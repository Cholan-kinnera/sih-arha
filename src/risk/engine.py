"""Dynamic Risk Engine & Evidence Synthesis for LEWS."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Union
import numpy as np

from ml.inference.predict import SusceptibilityPredictor
from src.risk.config import (
    DEFAULT_RISK_WEIGHTS,
    DYNAMIC_RISK_DISCLAIMER,
    RISK_SEVERITY_THRESHOLDS,
    TERRAIN_SCALING,
)
from src.risk.rainfall import RainfallAccumulator, compute_rainfall_factor
from src.risk.types import (
    DataFreshnessStatus,
    DynamicRiskEvaluation,
    RainfallAccumulation,
    RiskContributingFactors,
    RiskEvidenceBundle,
    SeverityLevel,
    TelemetryProvenance,
    TelemetryReading,
)

logger = logging.getLogger(__name__)


def map_score_to_severity(score: float) -> SeverityLevel:
    """Map continuous risk score [0.0 - 1.0] onto standard project severity level."""
    clamped = max(0.0, min(1.0, float(score)))
    if clamped >= RISK_SEVERITY_THRESHOLDS["CRITICAL"]:
        return SeverityLevel.CRITICAL
    if clamped >= RISK_SEVERITY_THRESHOLDS["HIGH"]:
        return SeverityLevel.HIGH
    if clamped >= RISK_SEVERITY_THRESHOLDS["MODERATE"]:
        return SeverityLevel.MODERATE
    return SeverityLevel.LOW


class DynamicRiskEngine:
    """Deterministic, explainable dynamic risk evaluation engine."""

    def __init__(self, susceptibility_predictor: Optional[SusceptibilityPredictor] = None):
        self.predictor = susceptibility_predictor
        self._init_predictor()

    def _init_predictor(self) -> None:
        """Lazily initialize ML susceptibility predictor if not explicitly provided."""
        if self.predictor is None:
            try:
                self.predictor = SusceptibilityPredictor()
            except Exception as e:
                logger.warning("Could not initialize ML SusceptibilityPredictor: %s", e)

    def evaluate_zone_risk(
        self,
        zone_id: str,
        state: str,
        district: str,
        static_features: Dict[str, Any],
        rainfall_readings: Optional[List[TelemetryReading]] = None,
        soil_moisture_pct: Optional[float] = None,
        terrain_features: Optional[Dict[str, Any]] = None,
        as_of_time: Optional[datetime] = None,
    ) -> RiskEvidenceBundle:
        """Evaluate dynamic risk score and produce auditable evidence bundle."""
        now = as_of_time or datetime.now(timezone.utc)
        audit_trail: List[str] = []
        degraded_reasons: List[str] = []
        data_freshness: Dict[str, DataFreshnessStatus] = {}

        # 1. Static Susceptibility Prior (ML Baseline)
        if self.predictor is not None:
            try:
                pred_res = self.predictor.predict_susceptibility(static_features)
                static_susc = float(pred_res["susceptibility_probability"])
                model_ver = str(pred_res["model_version"])
                audit_trail.append(f"Evaluated ML susceptibility prior: {static_susc:.4f} (Model: {model_ver})")
            except Exception as e:
                static_susc = 0.20  # Neutral fallback prior
                model_ver = "fallback-prior-v0"
                degraded_reasons.append(f"ML_PREDICTOR_ERROR: {e}")
                audit_trail.append(f"ML predictor error; applied fallback prior: {static_susc}")
        else:
            static_susc = 0.20
            model_ver = "fallback-prior-v0"
            degraded_reasons.append("ML_PREDICTOR_UNAVAILABLE")

        # 2. Terrain Factor
        terrain_available = False
        terrain_factor: Optional[float] = None
        if terrain_features and terrain_features.get("terrain_coverage", False):
            mean_slope = float(terrain_features.get("mean_slope_deg", 0.0))
            mean_tri = float(terrain_features.get("mean_tri", 0.0))

            f_slope = min(1.0, max(0.0, mean_slope / TERRAIN_SCALING["critical_slope_deg"]))
            f_tri = min(1.0, max(0.0, mean_tri / TERRAIN_SCALING["critical_tri"]))
            terrain_factor = round(0.70 * f_slope + 0.30 * f_tri, 4)
            terrain_available = True
            data_freshness["terrain"] = DataFreshnessStatus.AVAILABLE
            audit_trail.append(f"Calculated terrain factor: {terrain_factor:.4f} (Slope: {mean_slope:.1f}°, TRI: {mean_tri:.1f})")
        else:
            data_freshness["terrain"] = DataFreshnessStatus.MISSING
            degraded_reasons.append("TERRAIN_DATA_UNAVAILABLE")
            audit_trail.append("Terrain raster data unavailable for zone; factor excluded.")

        # 3. Dynamic Rainfall Accumulation & Factor
        readings = rainfall_readings or []
        accumulation = RainfallAccumulator.calculate_from_readings(readings, as_of_time=now)
        rainfall_factor = compute_rainfall_factor(accumulation)
        data_freshness["rainfall"] = accumulation.freshness
        audit_trail.append(
            f"Calculated rainfall factor: {rainfall_factor:.4f} "
            f"(24h: {accumulation.rainfall_24h_mm}mm, 72h: {accumulation.rainfall_72h_mm}mm, Freshness: {accumulation.freshness.value})"
        )

        # 4. Soil Moisture Factor
        soil_factor: Optional[float] = None
        if soil_moisture_pct is not None:
            soil_factor = round(float(np.clip(soil_moisture_pct / 100.0, 0.0, 1.0)), 4)
            data_freshness["soil_moisture"] = DataFreshnessStatus.AVAILABLE
            audit_trail.append(f"Calculated soil moisture factor: {soil_factor:.4f} ({soil_moisture_pct:.1f}%)")
        else:
            data_freshness["soil_moisture"] = DataFreshnessStatus.MISSING
            degraded_reasons.append("SOIL_MOISTURE_UNAVAILABLE")
            audit_trail.append("Soil moisture telemetry unavailable; factor excluded.")

        # 5. Historical Context Factor
        hist_count = float(static_features.get("historical_landslide_count", 0))
        hist_factor = round(float(np.clip(hist_count / 5.0, 0.0, 1.0)), 4)
        audit_trail.append(f"Calculated historical context factor: {hist_factor:.4f} (Count: {hist_count})")

        # 6. Dynamic Weight Allocation (Handling Missing Factors Proportionally)
        active_weights: Dict[str, float] = {}
        active_scores: Dict[str, float] = {}

        # Static Susceptibility
        active_weights["static_susceptibility"] = DEFAULT_RISK_WEIGHTS["static_susceptibility"]
        active_scores["static_susceptibility"] = static_susc

        # Rainfall
        active_weights["rainfall"] = DEFAULT_RISK_WEIGHTS["rainfall"]
        active_scores["rainfall"] = rainfall_factor

        # Historical Context
        active_weights["historical_context"] = DEFAULT_RISK_WEIGHTS["historical_context"]
        active_scores["historical_context"] = hist_factor

        # Terrain (if available)
        if terrain_factor is not None:
            active_weights["terrain"] = DEFAULT_RISK_WEIGHTS["terrain"]
            active_scores["terrain"] = terrain_factor

        # Soil Moisture (if available)
        if soil_factor is not None:
            active_weights["soil_moisture"] = DEFAULT_RISK_WEIGHTS["soil_moisture"]
            active_scores["soil_moisture"] = soil_factor

        # Normalize weights to sum to 1.0
        total_weight = sum(active_weights.values())
        normalized_weights = {k: round(w / total_weight, 4) for k, w in active_weights.items()}

        # 7. Compute Final Dynamic Risk Score
        dynamic_score = sum(normalized_weights[k] * active_scores[k] for k in active_weights)
        dynamic_score = round(float(np.clip(dynamic_score, 0.0, 1.0)), 4)
        severity = map_score_to_severity(dynamic_score)

        degraded_mode = len(degraded_reasons) > 0
        overall_provenance = (
            TelemetryProvenance.SIMULATED if accumulation.provenance == TelemetryProvenance.SIMULATED
            else TelemetryProvenance.LIVE
        )

        factors = RiskContributingFactors(
            static_susceptibility=static_susc,
            terrain_factor=terrain_factor,
            rainfall_factor=rainfall_factor,
            soil_moisture_factor=soil_factor,
            historical_context=hist_factor,
        )

        evaluation = DynamicRiskEvaluation(
            zone_id=zone_id,
            state=state,
            district=district,
            dynamic_risk_score=dynamic_score,
            severity_level=severity,
            degraded_mode=degraded_mode,
            degraded_reasons=degraded_reasons,
            contributing_factors=factors,
            factor_weights_used=normalized_weights,
            data_freshness=data_freshness,
            timestamp_utc=now,
            model_version=model_ver,
            provenance=overall_provenance,
            scientific_disclaimer=DYNAMIC_RISK_DISCLAIMER,
        )

        # 8. Human-Readable Explanation Summary
        explanation = (
            f"Zone '{zone_id}' ({district}, {state}) evaluated at {dynamic_score:.2f} ({severity.value}). "
            f"Primary contributors: Static ML Susceptibility ({static_susc:.2f}), "
            f"Rainfall Factor ({rainfall_factor:.2f} based on {accumulation.rainfall_24h_mm}mm/24h). "
            + (f"Operating in DEGRADED MODE due to: {', '.join(degraded_reasons)}." if degraded_mode else "All telemetry active.")
        )

        return RiskEvidenceBundle(
            zone_id=zone_id,
            evaluation=evaluation,
            rainfall_accumulation=accumulation,
            terrain_available=terrain_available,
            explanation_summary=explanation,
            audit_trail=audit_trail,
        )
