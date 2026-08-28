"""Operational Alert Operations Routes (Async)."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.session import get_async_db
from apps.api.app.schemas.alert import (
    AlertAcknowledgeRequest,
    AlertAuditResponse,
    AlertListResponse,
    AlertResponse,
)
from apps.api.app.services.alert_service import (
    acknowledge_alert,
    get_alert_audit_trail,
    get_alerts_paginated,
)

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get(
    "",
    response_model=AlertListResponse,
    status_code=status.HTTP_200_OK,
    summary="List operational alerts with triage filters",
)
async def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity (HIGH, CRITICAL)"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (ACTIVE, ACKNOWLEDGED, RESOLVED)"),
    zone_id: Optional[str] = Query(None, description="Filter by monitored zone identifier"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_async_db),
) -> AlertListResponse:
    """Retrieve filtered, paginated list of operational alerts."""
    alerts, total = await get_alerts_paginated(
        db=db,
        severity=severity,
        status=status_filter,
        zone_id=zone_id,
        page=page,
        page_size=page_size,
    )

    alert_responses = [
        AlertResponse(
            alert_id=a.alert_id,
            zone_id=a.zone.zone_id if a.zone else "UNKNOWN",
            severity=a.severity,
            risk_score=a.risk_score,
            status=a.status,
            trigger_reason=a.trigger_reason,
            provenance=a.provenance,
            created_at=a.created_at,
            acknowledged_at=a.acknowledged_at,
            resolved_at=a.resolved_at,
        )
        for a in alerts
    ]

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return AlertListResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=pages,
        alerts=alert_responses,
    )


@router.get(
    "/{alert_id}",
    response_model=AlertResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve single alert details",
)
async def get_single_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_async_db),
) -> AlertResponse:
    """Retrieve operational alert by its human-readable identifier."""
    alerts, _ = await get_alerts_paginated(db=db, page=1, page_size=1)
    # Match by ID
    for a in alerts:
        if a.alert_id == alert_id:
            return AlertResponse(
                alert_id=a.alert_id,
                zone_id=a.zone.zone_id if a.zone else "UNKNOWN",
                severity=a.severity,
                risk_score=a.risk_score,
                status=a.status,
                trigger_reason=a.trigger_reason,
                provenance=a.provenance,
                created_at=a.created_at,
                acknowledged_at=a.acknowledged_at,
                resolved_at=a.resolved_at,
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Alert '{alert_id}' not found.",
    )


@router.post(
    "/{alert_id}/acknowledge",
    response_model=AlertResponse,
    status_code=status.HTTP_200_OK,
    summary="Acknowledge an active operational alert",
)
async def acknowledge_operational_alert(
    alert_id: str,
    payload: AlertAcknowledgeRequest,
    db: AsyncSession = Depends(get_async_db),
) -> AlertResponse:
    """Operator triage action acknowledging an active alert and creating an immutable audit entry."""
    updated = await acknowledge_alert(
        db=db,
        alert_id=alert_id,
        operator_id=payload.operator_id,
        notes=payload.notes,
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert '{alert_id}' not found.",
        )

    return AlertResponse(
        alert_id=updated.alert_id,
        zone_id=updated.zone.zone_id if updated.zone else "UNKNOWN",
        severity=updated.severity,
        risk_score=updated.risk_score,
        status=updated.status,
        trigger_reason=updated.trigger_reason,
        provenance=updated.provenance,
        created_at=updated.created_at,
        acknowledged_at=updated.acknowledged_at,
        resolved_at=updated.resolved_at,
    )


@router.get(
    "/{alert_id}/audit",
    response_model=List[AlertAuditResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve immutable chronological audit trail for an alert",
)
async def get_alert_audit_history(
    alert_id: str,
    db: AsyncSession = Depends(get_async_db),
) -> List[AlertAuditResponse]:
    """Retrieve full append-only audit trail for an alert."""
    audits = await get_alert_audit_trail(db=db, alert_id=alert_id)
    if not audits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Audit trail for alert '{alert_id}' not found.",
        )

    return [
        AlertAuditResponse(
            alert_id=aid_str,
            action=aud.action,
            operator_id=aud.operator_id,
            notes=aud.notes or "",
            timestamp_utc=aud.timestamp,
        )
        for aud, aid_str in audits
    ]
