"""Pytest Test Configuration and Fixtures for LEWS Backend API (Async Engine)."""

from __future__ import annotations

import os
import uuid
from typing import AsyncGenerator, Generator
import pandas as pd
import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from apps.api.app.config import settings
from apps.api.app.db.base import Base
from apps.api.app.db.models.data_source import DataSourceModel
from apps.api.app.db.models.zone import Zone, ZoneTerrainFeatures
from apps.api.app.db.session import get_async_db
from apps.api.app.main import app
from src.data.loaders import get_project_root

# Ensure testing environment mode
settings.ENVIRONMENT = "testing"

TEST_ASYNC_DB_URL = "sqlite+aiosqlite:///:memory:"

test_async_engine = create_async_engine(
    TEST_ASYNC_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestAsyncSessionLocal = async_sessionmaker(
    bind=test_async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def async_seed_test_database(session: AsyncSession) -> None:
    """Async seeding helper for test database."""
    root = get_project_root()
    df_base = pd.read_parquet(root / "data" / "processed" / "lews_baseline_dataset.parquet")
    df_terrain = pd.read_parquet(root / "data" / "processed" / "terrain_zone_features.parquet")

    terrain_map = {
        (row["state"].strip().upper(), row["district"].strip().upper()): row.to_dict()
        for _, row in df_terrain.iterrows()
    }

    for _, row in df_base.iterrows():
        st = row["state"].strip().upper()
        dist = row["district"].strip().upper()
        zid = f"ZONE-{st.replace(' ', '_')}-{dist.replace(' ', '_')}"

        z = Zone(
            id=uuid.uuid4(),
            zone_id=zid,
            name=f"{dist.title()} Catchment",
            state=st,
            district=dist,
            subdivision=str(row["subdivision"]) if pd.notna(row.get("subdivision")) else None,
            is_ner=bool(row["is_ner"]),
        )
        session.add(z)
        await session.flush()

        t_data = terrain_map.get((st, dist))
        if t_data:
            tf = ZoneTerrainFeatures(
                id=uuid.uuid4(),
                zone_id=z.id,
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

    # Seed data sources
    src = DataSourceModel(
        id=uuid.uuid4(),
        source_id="SRC-IMD-NORMALS",
        name="IMD District Rainfall Normals (1951-2000)",
        provider="India Meteorological Department (IMD)",
        category="CLIMATOLOGY",
        status="CONNECTED",
        freshness="FRESH",
        provenance="HISTORICAL",
        cadence="Climatological 50-Year Baseline",
        record_count=641,
    )
    session.add(src)

    src_gsi = DataSourceModel(
        id=uuid.uuid4(),
        source_id="SRC-GSI-LANDSLIDES",
        name="GSI Historical Landslide Event Inventory",
        provider="Geological Survey of India (GSI) / Open Data",
        category="GEOLOGICAL",
        status="CONNECTED",
        freshness="FRESH",
        provenance="HISTORICAL",
        cadence="Validated Historical Incidents",
        record_count=87,
    )
    session.add(src_gsi)

    src_sub = DataSourceModel(
        id=uuid.uuid4(),
        source_id="SRC-IMD-SUBDIVISION",
        name="IMD Meteorological Subdivision Series (1901-2015)",
        provider="India Meteorological Department (IMD)",
        category="CLIMATOLOGY",
        status="CONNECTED",
        freshness="FRESH",
        provenance="HISTORICAL",
        cadence="115-Year Historical Time Series",
        record_count=4116,
    )
    session.add(src_sub)

    src_gpm = DataSourceModel(
        id=uuid.uuid4(),
        source_id="SRC-NASA-GPM-IMERG",
        name="NASA GPM IMERG Near-Real-Time Precipitation",
        provider="NASA Precipitation Processing System (PPS)",
        category="PRECIPITATION",
        status="CONNECTED",
        freshness="FRESH",
        provenance="SIMULATED",
        cadence="30-Minute Telemetry Stream",
        record_count=2880,
    )
    session.add(src_gpm)

    src_dem = DataSourceModel(
        id=uuid.uuid4(),
        source_id="SRC-BHUVAN-DEM",
        name="ISRO Bhuvan / SRTM Digital Elevation Model",
        provider="ISRO / National Remote Sensing Centre",
        category="TERRAIN",
        status="DEGRADED",
        freshness="STALE",
        provenance="TERRAIN_UNAVAILABLE",
        cadence="30m Spatial Grid",
        record_count=0,
    )
    session.add(src_dem)
    await session.commit()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_database():
    """Create test tables and seed minimal fixture data."""
    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestAsyncSessionLocal() as session:
        await async_seed_test_database(session)

    yield

    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_async_engine.dispose()


@pytest_asyncio.fixture
async def async_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provide an isolated async session per test."""
    async with TestAsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.rollback()
            await session.close()


@pytest.fixture
def client(setup_test_database) -> Generator[TestClient, None, None]:
    """FastAPI TestClient with overridden get_async_db dependency."""
    async def override_get_async_db() -> AsyncGenerator[AsyncSession, None]:
        async with TestAsyncSessionLocal() as session:
            try:
                yield session
            finally:
                pass

    app.dependency_overrides[get_async_db] = override_get_async_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
