"""Telemetry Ingestion & WebSocket Pydantic Schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class TelemetryIngestRequest(BaseModel):
    """Single telemetry reading ingestion payload."""

    sensor_id: str = Field(..., min_length=1, max_length=64, description="Unique sensor identifier")
    zone_id: str = Field(..., min_length=1, max_length=64, description="Target zone identifier")
    timestamp_utc: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Observation timestamp in UTC",
    )
    measurement_type: str = Field(
        ...,
        description="Measurement metric: 'rainfall_rate_mm_h', 'soil_moisture_pct', 'pore_pressure_kpa'",
    )
    value: float = Field(..., description="Observed numeric measurement value")
    unit: str = Field(..., description="Measurement unit (e.g. 'mm/h', '%', 'kPa')")
    provenance: str = Field(
        "SIMULATED",
        description="Data provenance: 'LIVE', 'SIMULATED', 'HISTORICAL', 'EXPERIMENTAL'",
    )
    metadata_json: Optional[Dict[str, Any]] = None


class TelemetryIngestResponse(BaseModel):
    """Result of telemetry ingestion and subsequent risk update."""

    status: str
    sensor_id: str
    zone_id: str
    measurement_type: str
    value: float
    unit: str
    provenance: str
    zone_risk_updated: bool
    dynamic_risk_score: Optional[float] = None
    severity_level: Optional[str] = None
    alert_triggered: bool = False
    alert_id: Optional[str] = None


class WebSocketTelemetryMessage(BaseModel):
    """Real-time telemetry message pushed over WebSocket."""

    type: str = "TELEMETRY_UPDATE"
    timestamp_utc: datetime
    zone_id: str
    sensor_id: str
    measurement_type: str
    value: float
    unit: str
    provenance: str
