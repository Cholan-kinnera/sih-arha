"""Dynamic Risk Evaluation Orchestration Service (Async)."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from apps.api.app.db.models.risk import RiskEvaluationModel
from apps.api.app.db.models.telemetry import TelemetryReadingModel
from apps.api.app.db.models.zone import Zone
from apps.api.app.schemas.risk import (
    RiskContributingFactorsSchema,
    RiskEvaluationResponse,
    RiskMatrixResponse,
)
from apps.api.app.services.alert_service import evaluate_alert_creation
from src.data.loaders import get_project_root
from src.risk.engine import DynamicRiskEngine
from src.risk.types import RiskEvidenceBundle, TelemetryProvenance, TelemetryReading

logger = logging.getLogger(__name__)

_risk_engine: Optional[DynamicRiskEngine] = None


def get_risk_engine() -> DynamicRiskEngine:
    """Retrieve or initialize the DynamicRiskEngine singleton."""
    global _risk_engine
    if _risk_engine is None:
        _risk_engine = DynamicRiskEngine()
    return _risk_engine


def load_static_district_features(state: str, district: str) -> Dict[str, Any]:
    """Load baseline climatological predictors for a district from the master baseline dataset."""
    root = get_project_root()
    parquet_path = root / "data" / "processed" / "lews_baseline_dataset.parquet"

    if not parquet_path.exists():
        return {}

    df = pd.read_parquet(parquet_path)
    match = df[(df["state"].str.upper() == state.upper()) & (df["district"].str.upper() == district.upper())]
    if not match.empty:
        return match.iloc[0].to_dict()
    return {}


async def evaluate_and_persist_zone_risk(
    db: AsyncSession,
    zone_id_str: str,
    as_of_time: Optional[datetime] = None,
) -> Optional[RiskEvidenceBundle]:
    """Orchestrate dynamic risk calculation for a zone, persist the evaluation, and evaluate alerts."""
    now = as_of_time or datetime.now(timezone.utc)

    # 1. Fetch Zone and Terrain
    stmt = select(Zone).options(joinedload(Zone.terrain)).where(Zone.zone_id == zone_id_str)
    zone = (await db.scalars(stmt)).first()
    if not zone:
        logger.warning("Cannot evaluate risk: Zone %s not found", zone_id_str)
        return None

    terrain_dict = None
    if zone.terrain:
        terrain_dict = {
            "terrain_coverage": zone.terrain.terrain_coverage,
            "terrain_status": "AVAILABLE" if zone.terrain.terrain_coverage else "UNAVAILABLE",
            "mean_elevation_m": zone.terrain.elevation_mean,
            "mean_slope_deg": zone.terrain.slope_mean,
            "mean_tri": zone.terrain.tri_mean,
            "provenance": zone.terrain.source_provenance,
        }

    # 2. Fetch Static Baseline Climatological Features
    static_features = load_static_district_features(zone.state, zone.district)

    # 3. Query Recent Telemetry from Database (Past 72 hours)
    cutoff_72h = now - timedelta(hours=72)
    telemetry_stmt = (
        select(TelemetryReadingModel)
        .where(
            TelemetryReadingModel.zone_id == zone.id,
            TelemetryReadingModel.timestamp >= cutoff_72h,
        )
        .order_by(TelemetryReadingModel.timestamp.asc())
    )
    db_readings = (await db.scalars(telemetry_stmt)).all()

    rainfall_readings: List[TelemetryReading] = []
    latest_soil_moisture: Optional[float] = None

    for r in db_readings:
        if r.measurement_type == "rainfall_rate_mm_h":
            prov = (
                TelemetryProvenance.SIMULATED if r.provenance == "SIMULATED"
                else TelemetryProvenance.LIVE
            )
            rainfall_readings.append(
                TelemetryReading(
                    zone_id=zone_id_str,
                    timestamp_utc=r.timestamp,
                    rainfall_rate_mm_h=r.value,
                    provenance=prov,
                )
            )
        elif r.measurement_type == "soil_moisture_pct":
            latest_soil_moisture = r.value

    # 4. Invoke DynamicRiskEngine
    engine = get_risk_engine()
    bundle = engine.evaluate_zone_risk(
        zone_id=zone_id_str,
        state=zone.state,
        district=zone.district,
        static_features=static_features,
        rainfall_readings=rainfall_readings,
        soil_moisture_pct=latest_soil_moisture,
        terrain_features=terrain_dict,
        as_of_time=now,
    )

    eval_data = bundle.evaluation

    # 5. Persist RiskEvaluationModel
    record = RiskEvaluationModel(
        zone_id=zone.id,
        timestamp=eval_data.timestamp_utc,
        dynamic_risk_score=eval_data.dynamic_risk_score,
        severity=eval_data.severity_level.value,
        static_susceptibility=eval_data.contributing_factors.static_susceptibility,
        terrain_factor=eval_data.contributing_factors.terrain_factor,
        rainfall_factor=eval_data.contributing_factors.rainfall_factor,
        soil_factor=eval_data.contributing_factors.soil_moisture_factor,
        historical_factor=eval_data.contributing_factors.historical_context,
        degraded_mode=eval_data.degraded_mode,
        degraded_reasons={"reasons": eval_data.degraded_reasons},
        model_version=eval_data.model_version,
        provenance=eval_data.provenance.value,
        evidence=bundle.model_dump(mode="json"),
        created_at=now,
    )
    db.add(record)
    await db.flush()

    # 6. Evaluate Operational Alert Trigger
    await evaluate_alert_creation(
        db=db,
        zone_db_id=zone.id,
        dynamic_risk_score=eval_data.dynamic_risk_score,
        severity=eval_data.severity_level.value,
        trigger_reason=bundle.explanation_summary,
        risk_evaluation_id=record.id,
        provenance=eval_data.provenance.value,
    )

    await db.commit()
    return bundle


async def get_current_risk_matrix(db: AsyncSession) -> RiskMatrixResponse:
    """Retrieve latest risk evaluation for every monitored zone."""
    subquery = (
        select(
            RiskEvaluationModel.zone_id,
            func.max(RiskEvaluationModel.timestamp).label("max_time"),
        )
        .group_by(RiskEvaluationModel.zone_id)
        .subquery()
    )

    stmt = (
        select(RiskEvaluationModel, Zone.zone_id, Zone.state, Zone.district)
        .join(Zone, RiskEvaluationModel.zone_id == Zone.id)
        .join(
            subquery,
            (RiskEvaluationModel.zone_id == subquery.c.zone_id)
            & (RiskEvaluationModel.timestamp == subquery.c.max_time),
        )
        .order_by(RiskEvaluationModel.dynamic_risk_score.desc())
    )

    results = (await db.execute(stmt)).all()

    evaluations: List[RiskEvaluationResponse] = []
    severity_counts = {"LOW": 0, "MODERATE": 0, "HIGH": 0, "CRITICAL": 0}

    for record, zid_str, state, district in results:
        sev = record.severity
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

        factors = RiskContributingFactorsSchema(
            static_susceptibility=record.static_susceptibility or 0.0,
            terrain_factor=record.terrain_factor,
            rainfall_factor=record.rainfall_factor or 0.0,
            soil_moisture_factor=record.soil_factor,
            historical_context=record.historical_factor or 0.0,
        )

        reasons = (
            record.degraded_reasons.get("reasons", [])
            if isinstance(record.degraded_reasons, dict)
            else []
        )

        evidence_payload = record.evidence if isinstance(record.evidence, dict) else {}
        weights = evidence_payload.get("evaluation", {}).get("factor_weights_used", {})
        freshness = evidence_payload.get("evaluation", {}).get("data_freshness", {})
        disclaimer = evidence_payload.get("evaluation", {}).get("scientific_disclaimer", "")

        evaluations.append(
            RiskEvaluationResponse(
                zone_id=zid_str,
                state=state,
                district=district,
                dynamic_risk_score=record.dynamic_risk_score,
                severity_level=record.severity,
                degraded_mode=record.degraded_mode,
                degraded_reasons=reasons,
                contributing_factors=factors,
                factor_weights_used=weights,
                data_freshness=freshness,
                timestamp_utc=record.timestamp,
                model_version=record.model_version or "lews-susceptibility-baseline-v1.0.0",
                provenance=record.provenance,
                scientific_disclaimer=disclaimer,
            )
        )

    return RiskMatrixResponse(
        timestamp_utc=datetime.now(timezone.utc),
        total_zones=len(evaluations),
        severity_distribution=severity_counts,
        evaluations=evaluations,
    )


async def get_zone_latest_risk(db: AsyncSession, zone_id: str) -> Optional[RiskEvaluationResponse]:
    """Retrieve the latest dynamic risk evaluation for a single zone."""
    stmt = (
        select(RiskEvaluationModel, Zone.zone_id, Zone.state, Zone.district)
        .join(Zone, RiskEvaluationModel.zone_id == Zone.id)
        .where(Zone.zone_id == zone_id)
        .order_by(RiskEvaluationModel.timestamp.desc())
        .limit(1)
    )
    result = (await db.execute(stmt)).first()
    if not result:
        # Trigger on-demand evaluation
        bundle = await evaluate_and_persist_zone_risk(db, zone_id)
        if not bundle:
            return None
        ev = bundle.evaluation
        factors = RiskContributingFactorsSchema(
            static_susceptibility=ev.contributing_factors.static_susceptibility,
            terrain_factor=ev.contributing_factors.terrain_factor,
            rainfall_factor=ev.contributing_factors.rainfall_factor,
            soil_moisture_factor=ev.contributing_factors.soil_moisture_factor,
            historical_context=ev.contributing_factors.historical_context,
        )
        return RiskEvaluationResponse(
            zone_id=ev.zone_id,
            state=ev.state,
            district=ev.district,
            dynamic_risk_score=ev.dynamic_risk_score,
            severity_level=ev.severity_level.value,
            degraded_mode=ev.degraded_mode,
            degraded_reasons=ev.degraded_reasons,
            contributing_factors=factors,
            factor_weights_used=ev.factor_weights_used,
            data_freshness={k: v.value for k, v in ev.data_freshness.items()},
            timestamp_utc=ev.timestamp_utc,
            model_version=ev.model_version,
            provenance=ev.provenance.value,
            scientific_disclaimer=ev.scientific_disclaimer,
        )

    record, zid, state, district = result
    factors = RiskContributingFactorsSchema(
        static_susceptibility=record.static_susceptibility or 0.0,
        terrain_factor=record.terrain_factor,
        rainfall_factor=record.rainfall_factor or 0.0,
        soil_moisture_factor=record.soil_factor,
        historical_context=record.historical_factor or 0.0,
    )
    reasons = (
        record.degraded_reasons.get("reasons", [])
        if isinstance(record.degraded_reasons, dict)
        else []
    )
    evidence_payload = record.evidence if isinstance(record.evidence, dict) else {}
    weights = evidence_payload.get("evaluation", {}).get("factor_weights_used", {})
    freshness = evidence_payload.get("evaluation", {}).get("data_freshness", {})
    disclaimer = evidence_payload.get("evaluation", {}).get("scientific_disclaimer", "")

    return RiskEvaluationResponse(
        zone_id=zid,
        state=state,
        district=district,
        dynamic_risk_score=record.dynamic_risk_score,
        severity_level=record.severity,
        degraded_mode=record.degraded_mode,
        degraded_reasons=reasons,
        contributing_factors=factors,
        factor_weights_used=weights,
        data_freshness=freshness,
        timestamp_utc=record.timestamp,
        model_version=record.model_version or "lews-susceptibility-baseline-v1.0.0",
        provenance=record.provenance,
        scientific_disclaimer=disclaimer,
    )
