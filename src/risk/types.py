"""Typed Domain Models & Schemas for LEWS Dynamic Risk Subsystem."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TelemetryProvenance(str, Enum):
    """Provenance tracking for observational data."""
    LIVE = "LIVE"
    SIMULATED = "SIMULATED"
    HISTORICAL = "HISTORICAL"
    CLIMATOLOGICAL = "CLIMATOLOGICAL"
    EXPERIMENTAL = "EXPERIMENTAL"


class DataFreshnessStatus(str, Enum):
    """Freshness status of operational telemetry streams."""
    AVAILABLE = "AVAILABLE"
    STALE = "STALE"
    MISSING = "MISSING"
    SIMULATED = "SIMULATED"


class SeverityLevel(str, Enum):
    """Standard project risk severity classification tiers."""
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TelemetryReading(BaseModel):
    """Single time-stamped observational sensor reading."""
    zone_id: str
    timestamp_utc: datetime
    rainfall_rate_mm_h: float = Field(ge=0.0)
    soil_moisture_pct: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    provenance: TelemetryProvenance = TelemetryProvenance.SIMULATED


class RainfallAccumulation(BaseModel):
    """Multi-duration accumulated precipitation metrics."""
    rainfall_1h_mm: float = Field(ge=0.0)
    rainfall_6h_mm: float = Field(ge=0.0)
    rainfall_24h_mm: float = Field(ge=0.0)
    rainfall_48h_mm: float = Field(ge=0.0)
    rainfall_72h_mm: float = Field(ge=0.0)
    provenance: TelemetryProvenance = TelemetryProvenance.SIMULATED
    freshness: DataFreshnessStatus = DataFreshnessStatus.SIMULATED


class RiskContributingFactors(BaseModel):
    """Auditable decomposition of normalized sub-factors [0.0 - 1.0]."""
    static_susceptibility: float = Field(ge=0.0, le=1.0)
    terrain_factor: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    rainfall_factor: float = Field(ge=0.0, le=1.0)
    soil_moisture_factor: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    historical_context: float = Field(ge=0.0, le=1.0)


class DynamicRiskEvaluation(BaseModel):
    """Complete dynamic risk evaluation object."""
    zone_id: str
    state: str
    district: str
    dynamic_risk_score: float = Field(ge=0.0, le=1.0)
    severity_level: SeverityLevel
    degraded_mode: bool = False
    degraded_reasons: List[str] = Field(default_factory=list)
    contributing_factors: RiskContributingFactors
    factor_weights_used: Dict[str, float]
    data_freshness: Dict[str, DataFreshnessStatus]
    timestamp_utc: datetime
    model_version: str
    provenance: TelemetryProvenance
    scientific_disclaimer: str


class RiskEvidenceBundle(BaseModel):
    """Audit-ready evidence bundle explaining a zone's risk evaluation."""
    zone_id: str
    evaluation: DynamicRiskEvaluation
    rainfall_accumulation: RainfallAccumulation
    terrain_available: bool
    explanation_summary: str
    audit_trail: List[str] = Field(default_factory=list)
