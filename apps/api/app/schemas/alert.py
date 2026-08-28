"""Alerts & Audit History Pydantic Schemas."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class AlertResponse(BaseModel):
    """Operational alert record response."""

    alert_id: str
    zone_id: str
    severity: str
    risk_score: float
    status: str
    trigger_reason: str
    provenance: str
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


class AlertAcknowledgeRequest(BaseModel):
    """Payload for acknowledging an active alert."""

    operator_id: str = Field(..., min_length=1, max_length=64, description="ID of acting operator")
    notes: str = Field(..., min_length=1, description="Operational notes describing acknowledgment context")


class AlertAuditResponse(BaseModel):
    """Chronological audit log entry for an alert."""

    alert_id: str
    action: str
    operator_id: str
    notes: str
    timestamp_utc: datetime


class AlertListResponse(BaseModel):
    """List of alerts with pagination metadata."""

    total: int
    page: int
    page_size: int
    total_pages: int
    alerts: List[AlertResponse]
