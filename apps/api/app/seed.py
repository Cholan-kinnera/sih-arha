"""Production Async Database Seeder for LEWS Backend.

Populates:
1. Canonical Zones from data/processed/lews_baseline_dataset.parquet
2. Static Terrain Intelligence from data/processed/terrain_zone_features.parquet
3. Observational Data Source Catalog
4. Monitored Sensor Registry
5. Baseline Simulated Telemetry and Initial Risk Evaluations
"""

from __future__ import annotations

import asyncio
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional
import pandas as pd
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.base import Base
from apps.api.app.db.enums import (
    AlertStatus,
    Freshness,
    Provenance,
    Severity,
    SourceStatus,
)
from apps.api.app.db.models.data_source import DataSourceModel, IngestionEventModel
from apps.api.app.db.models.risk import RiskEvaluationModel
from apps.api.app.db.models.sensor import SensorModel
from apps.api.app.db.models.telemetry import TelemetryReadingModel
from apps.api.app.db.models.zone import Zone, ZoneTerrainFeatures
from apps.api.app.db.session import AsyncSessionLocal, async_engine
from simulator.telemetry_simulator import TelemetrySimulator
from src.data.loaders import get_project_root
from src.risk.engine import DynamicRiskEngine
from src.risk.types import TelemetryProvenance, TelemetryReading

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("seed")


def format_zone_id(state: str, district: str) -> str:
    """Create a canonical zone identifier from state and district."""
    s = state.strip().upper().replace(" ", "_")
    d = district.strip().upper().replace(" ", "_")
    return f"ZONE-{s}-{d}"


async def seed_zones_and_terrain(session: AsyncSession) -> Dict[str, Zone]:
    """Seed zones and terrain features from validated parquet datasets."""
    root = get_project_root()
    baseline_path = root / "data" / "processed" / "lews_baseline_dataset.parquet"
    terrain_path = root / "data" / "processed" / "terrain_zone_features.parquet"

    if not baseline_path.exists():
        raise FileNotFoundError(f"Required baseline dataset not found at {baseline_path}")

    df_base = pd.read_parquet(baseline_path)
    df_terrain = pd.read_parquet(terrain_path) if terrain_path.exists() else None

    logger.info("Found %d baseline records. Seeding canonical zones...", len(df_base))

    # Index terrain by (state, district)
    terrain_map = {}
    if df_terrain is not None:
        for _, row in df_terrain.iterrows():
            key = (row["state"].strip().upper(), row["district"].strip().upper())
            terrain_map[key] = row.to_dict()

    zones_by_id: Dict[str, Zone] = {}

    for _, row in df_base.iterrows():
        st = row["state"].strip().upper()
        dist = row["district"].strip().upper()
        zid = format_zone_id(st, dist)

        # Check existence
        stmt = select(Zone).where(Zone.zone_id == zid)
        existing = (await session.scalars(stmt)).first()

        subdiv_val = str(row["subdivision"]) if pd.notna(row.get("subdivision")) else None

        if not existing:
            zone = Zone(
                id=uuid.uuid4(),
                zone_id=zid,
                name=f"{dist.title()} Catchment",
                state=st,
                district=dist,
                subdivision=subdiv_val,
                is_ner=bool(row["is_ner"]),
            )
            session.add(zone)
            await session.flush()
        else:
            zone = existing

        zones_by_id[zid] = zone

        # Check terrain feature existence
        t_stmt = select(ZoneTerrainFeatures).where(ZoneTerrainFeatures.zone_id == zone.id)
        existing_terrain = (await session.scalars(t_stmt)).first()

        t_data = terrain_map.get((st, dist))
        if not existing_terrain and t_data:
            tf = ZoneTerrainFeatures(
                id=uuid.uuid4(),
                zone_id=zone.id,
                elevation_mean=None if pd.isna(t_data.get("mean_elevation_m")) else float(t_data["mean_elevation_m"]),
                elevation_min=None if pd.isna(t_data.get("min_elevation_m")) else float(t_data["min_elevation_m"]),
                elevation_max=None if pd.isna(t_data.get("max_elevation_m")) else float(t_data["max_elevation_m"]),
                elevation_std=None if pd.isna(t_data.get("elevation_std_m")) else float(t_data["elevation_std_m"]),
                slope_mean=None if pd.isna(t_data.get("mean_slope_deg")) else float(t_data["mean_slope_deg"]),
                slope_min=None if pd.isna(t_data.get("min_slope_deg")) else float(t_data["min_slope_deg"]),
                slope_max=None if pd.isna(t_data.get("max_slope_deg")) else float(t_data["max_slope_deg"]),
                slope_std=None if pd.isna(t_data.get("slope_std_deg")) else float(t_data["slope_std_deg"]),
                aspect_mean=None if pd.isna(t_data.get("mean_aspect_deg")) else float(t_data["mean_aspect_deg"]),
                tri_mean=None if pd.isna(t_data.get("mean_tri")) else float(t_data["mean_tri"]),
                terrain_coverage=bool(t_data.get("terrain_coverage", False)),
                source_provenance=str(t_data.get("provenance", "TERRAIN_UNAVAILABLE")),
            )
            session.add(tf)

    await session.commit()
    logger.info("Successfully synced %d zones.", len(zones_by_id))
    return zones_by_id


async def seed_data_sources(session: AsyncSession) -> Dict[str, DataSourceModel]:
    """Seed data sources catalog and initial ingestion event records."""
    catalog = [
        {
            "source_id": "SRC-IMD-NORMALS",
            "name": "IMD District Rainfall Normals (1951-2000)",
            "provider": "India Meteorological Department (IMD)",
            "category": "CLIMATOLOGY",
            "status": SourceStatus.CONNECTED.value,
            "freshness": Freshness.FRESH.value,
            "provenance": Provenance.HISTORICAL.value,
            "cadence": "Climatological 50-Year Baseline",
            "record_count": 641,
            "metadata": {"description": "Monthly and seasonal rainfall normals across all Indian districts."},
        },
        {
            "source_id": "SRC-GSI-LANDSLIDES",
            "name": "GSI Historical Landslide Event Inventory",
            "provider": "Geological Survey of India (GSI) / Open Data",
            "category": "GEOLOGICAL",
            "status": SourceStatus.CONNECTED.value,
            "freshness": Freshness.FRESH.value,
            "provenance": Provenance.HISTORICAL.value,
            "cadence": "Validated Historical Incidents",
            "record_count": 87,
            "metadata": {"description": "Historical landslide occurrences with coordinates in NER."},
        },
        {
            "source_id": "SRC-IMD-SUBDIVISION",
            "name": "IMD Meteorological Subdivision Series (1901-2015)",
            "provider": "India Meteorological Department (IMD)",
            "category": "CLIMATOLOGY",
            "status": SourceStatus.CONNECTED.value,
            "freshness": Freshness.FRESH.value,
            "provenance": Provenance.HISTORICAL.value,
            "cadence": "115-Year Historical Time Series",
            "record_count": 4116,
            "metadata": {"description": "Long-term regional monsoon rainfall series."},
        },
        {
            "source_id": "SRC-NASA-GPM-IMERG",
            "name": "NASA GPM IMERG Near-Real-Time Precipitation",
            "provider": "NASA Precipitation Processing System (PPS)",
            "category": "PRECIPITATION",
            "status": SourceStatus.CONNECTED.value,
            "freshness": Freshness.FRESH.value,
            "provenance": Provenance.SIMULATED.value,
            "cadence": "30-Minute Telemetry Stream",
            "record_count": 2880,
            "metadata": {"description": "Operational sub-daily satellite precipitation telemetry stream."},
        },
        {
            "source_id": "SRC-BHUVAN-DEM",
            "name": "ISRO Bhuvan / SRTM Digital Elevation Model",
            "provider": "ISRO / National Remote Sensing Centre",
            "category": "TERRAIN",
            "status": SourceStatus.DEGRADED.value,
            "freshness": Freshness.STALE.value,
            "provenance": "TERRAIN_UNAVAILABLE",
            "cadence": "30m Spatial Grid",
            "record_count": 0,
            "metadata": {"description": "Awaiting mounted GeoTIFF rasters in data/raw/terrain/."},
        },
    ]

    sources_by_id: Dict[str, DataSourceModel] = {}
    for item in catalog:
        stmt = select(DataSourceModel).where(DataSourceModel.source_id == item["source_id"])
        existing = (await session.scalars(stmt)).first()
        if not existing:
            src = DataSourceModel(
                id=uuid.uuid4(),
                source_id=item["source_id"],
                name=item["name"],
                provider=item["provider"],
                category=item["category"],
                status=item["status"],
                freshness=item["freshness"],
                provenance=item["provenance"],
                cadence=item["cadence"],
                last_ingested_at=datetime.now(timezone.utc),
                record_count=item["record_count"],
                metadata_json=item["metadata"],
            )
            session.add(src)
            await session.flush()
            sources_by_id[item["source_id"]] = src

            # Add initial IngestionEvent
            evt = IngestionEventModel(
                source_id=src.id,
                started_at=datetime.now(timezone.utc),
                completed_at=datetime.now(timezone.utc),
                status="SUCCESS",
                records_ingested=item["record_count"],
                duration_ms=120,
                message=f"Initial seed of {item['name']} catalog metadata.",
                provenance=item["provenance"],
                metadata_json=item["metadata"],
            )
            session.add(evt)
        else:
            sources_by_id[item["source_id"]] = existing

    await session.commit()
    logger.info("Successfully synced %d data sources.", len(sources_by_id))
    return sources_by_id


async def seed_sensors_and_telemetry(
    session: AsyncSession,
    zones_by_id: Dict[str, Zone],
    sources_by_id: Dict[str, DataSourceModel],
) -> int:
    """Seed physical/virtual sensors, 72-hour simulated telemetry, and dynamic risk evaluations."""
    sim = TelemetrySimulator(random_seed=42)
    engine = DynamicRiskEngine()
    gpm_source = sources_by_id.get("SRC-NASA-GPM-IMERG")

    demo_scenarios = [
        ("ZONE-SIKKIM-EAST_SIKKIM", "HEAVY_MONSOON_BURST"),
        ("ZONE-MIZORAM-AIZAWL", "MODERATE_SHOWERS"),
        ("ZONE-MEGHALAYA-EAST_KHASI_HILLS", "HEAVY_MONSOON_BURST"),
        ("ZONE-NAGALAND-KOHIMA", "MODERATE_SHOWERS"),
        ("ZONE-ASSAM-DIMA_HASAO", "BASELINE_DRY"),
        ("ZONE-ARUNACHAL_PRADESH-PAPUM_PARE", "MODERATE_SHOWERS"),
    ]

    total_readings = 0
    now = datetime.now(timezone.utc)

    # Load static dataset
    root = get_project_root()
    df_base = pd.read_parquet(root / "data" / "processed" / "lews_baseline_dataset.parquet")

    for zid, scenario in demo_scenarios:
        zone = zones_by_id.get(zid)
        if not zone:
            continue

        # Register Rain Sensor
        sensor_rain_id = f"SENS-{zid}-RAIN"
        stmt_s = select(SensorModel).where(SensorModel.sensor_id == sensor_rain_id)
        sensor_rain = (await session.scalars(stmt_s)).first()
        if not sensor_rain:
            sensor_rain = SensorModel(
                id=uuid.uuid4(),
                sensor_id=sensor_rain_id,
                zone_id=zone.id,
                source_id=gpm_source.id if gpm_source else None,
                name=f"{zone.name} Precipitation Gauge",
                sensor_type="RAINGAUGE_TELEMETERED",
                status="CONNECTED",
                installed_at=datetime(2025, 1, 1, tzinfo=timezone.utc),
            )
            session.add(sensor_rain)
            await session.flush()

        # Register Soil Sensor
        sensor_soil_id = f"SENS-{zid}-SOIL"
        stmt_soil = select(SensorModel).where(SensorModel.sensor_id == sensor_soil_id)
        sensor_soil = (await session.scalars(stmt_soil)).first()
        if not sensor_soil:
            sensor_soil = SensorModel(
                id=uuid.uuid4(),
                sensor_id=sensor_soil_id,
                zone_id=zone.id,
                source_id=gpm_source.id if gpm_source else None,
                name=f"{zone.name} Volumetric Soil Moisture Probe",
                sensor_type="SOIL_MOISTURE_PROBE",
                status="CONNECTED",
                installed_at=datetime(2025, 1, 1, tzinfo=timezone.utc),
            )
            session.add(sensor_soil)
            await session.flush()

        # Generate telemetry readings
        readings = sim.generate_zone_readings(zone_id=zid, scenario=scenario, duration_hours=72)
        rainfall_objs: List[TelemetryReading] = []

        for r in readings:
            t_record = TelemetryReadingModel(
                sensor_id=sensor_rain.id,
                zone_id=zone.id,
                timestamp=r.timestamp_utc,
                measurement_type="rainfall_rate_mm_h",
                value=r.rainfall_rate_mm_h,
                unit="mm/h",
                provenance=Provenance.SIMULATED.value,
            )
            session.add(t_record)
            rainfall_objs.append(
                TelemetryReading(
                    zone_id=zid,
                    timestamp_utc=r.timestamp_utc,
                    rainfall_rate_mm_h=r.rainfall_rate_mm_h,
                    provenance=TelemetryProvenance.SIMULATED,
                )
            )
            total_readings += 1

        # Add Soil Moisture reading
        soil_pct = 85.0 if scenario == "HEAVY_MONSOON_BURST" else (55.0 if scenario == "MODERATE_SHOWERS" else 25.0)
        s_record = TelemetryReadingModel(
            sensor_id=sensor_soil.id,
            zone_id=zone.id,
            timestamp=now,
            measurement_type="soil_moisture_pct",
            value=soil_pct,
            unit="%",
            provenance=Provenance.SIMULATED.value,
        )
        session.add(s_record)
        total_readings += 1

        # Evaluate and persist initial DynamicRiskEvaluation
        match = df_base[(df_base["state"].str.upper() == zone.state) & (df_base["district"].str.upper() == zone.district)]
        static_feat = match.iloc[0].to_dict() if not match.empty else {}

        bundle = engine.evaluate_zone_risk(
            zone_id=zid,
            state=zone.state,
            district=zone.district,
            static_features=static_feat,
            rainfall_readings=rainfall_objs,
            soil_moisture_pct=soil_pct,
            terrain_features=None,
            as_of_time=now,
        )

        ev = bundle.evaluation
        risk_record = RiskEvaluationModel(
            zone_id=zone.id,
            timestamp=ev.timestamp_utc,
            static_susceptibility=ev.contributing_factors.static_susceptibility,
            terrain_factor=ev.contributing_factors.terrain_factor,
            rainfall_factor=ev.contributing_factors.rainfall_factor,
            soil_factor=ev.contributing_factors.soil_moisture_factor,
            historical_factor=ev.contributing_factors.historical_context,
            dynamic_risk_score=ev.dynamic_risk_score,
            severity=ev.severity_level.value,
            provenance=ev.provenance.value,
            degraded_mode=ev.degraded_mode,
            degraded_reasons={"reasons": ev.degraded_reasons},
            model_version=ev.model_version,
            evidence=bundle.model_dump(mode="json"),
            created_at=now,
        )
        session.add(risk_record)

    await session.commit()
    logger.info("Seeded %d telemetry observations and initial dynamic risk evaluations.", total_readings)
    return total_readings


async def async_main() -> None:
    """Async main seeder entrypoint."""
    logger.info("Starting async database seeding...")

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        try:
            zones = await seed_zones_and_terrain(session)
            sources = await seed_data_sources(session)
            await seed_sensors_and_telemetry(session, zones, sources)
            logger.info("Async database seeding completed successfully.")
        except Exception as e:
            await session.rollback()
            logger.error("Error seeding database: %s", e, exc_info=True)
            raise


def main() -> None:
    """CLI wrapper."""
    asyncio.run(async_main())


if __name__ == "__main__":
    main()
