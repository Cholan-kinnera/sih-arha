"""Dynamic Risk API Pydantic Schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RiskContributingFactorsSchema(BaseModel):
    """Normalized contributing sub-factors [0.0 - 1.0]."""

    static_susceptibility: float
    terrain_factor: Optional[float] = None
    rainfall_factor: float
    soil_moisture_factor: Optional[float] = None
    historical_context: float


class RiskEvaluationResponse(BaseModel):
    """Structured dynamic risk evaluation API response."""

    zone_id: str
    state: str
    district: str
    dynamic_risk_score: float
    severity_level: str
    degraded_mode: bool
    degraded_reasons: List[str]
    contributing_factors: RiskContributingFactorsSchema
    factor_weights_used: Dict[str, float]
    data_freshness: Dict[str, str]
    timestamp_utc: datetime
    model_version: str
    provenance: str
    scientific_disclaimer: str


class RiskMatrixResponse(BaseModel):
    """Overview snapshot matrix across all monitored zones."""

    timestamp_utc: datetime
    total_zones: int
    severity_distribution: Dict[str, int]
    evaluations: List[RiskEvaluationResponse]
