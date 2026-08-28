"""Operational Alert Engine & Immutable Audit Service (Async)."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from apps.api.app.db.enums import AlertStatus, Provenance, Severity
from apps.api.app.db.models.alert import AlertAuditHistoryModel, AlertModel
from apps.api.app.db.models.zone import Zone

logger = logging.getLogger(__name__)


def generate_unique_alert_id() -> str:
    """Generate a clean human-readable operational alert identifier."""
    year = datetime.now(timezone.utc).year
    suffix = uuid.uuid4().hex[:6].upper()
    return f"ALT-{year}-{suffix}"


async def evaluate_alert_creation(
    db: AsyncSession,
    zone_db_id: uuid.UUID,
    dynamic_risk_score: float,
    severity: str,
    trigger_reason: str,
    risk_evaluation_id: Optional[int] = None,
    provenance: str = "SIMULATED",
) -> Optional[AlertModel]:
    """Evaluate whether an operational alert should be triggered upon risk update."""
    if severity not in (Severity.HIGH.value, Severity.CRITICAL.value):
        return None

    # Check for active unacknowledged alert for the same zone in the past 6 hours
    six_hours_ago = datetime.now(timezone.utc) - timedelta(hours=6)
    existing_alert_stmt = (
        select(AlertModel)
        .where(
            AlertModel.zone_id == zone_db_id,
            AlertModel.status == AlertStatus.ACTIVE.value,
            AlertModel.created_at >= six_hours_ago,
        )
    )
    existing = (await db.scalars(existing_alert_stmt)).first()
    if existing:
        logger.debug("Active alert already exists for zone %s: %s", zone_db_id, existing.alert_id)
        return None

    alert_id_str = generate_unique_alert_id()
    now = datetime.now(timezone.utc)

    alert = AlertModel(
        id=uuid.uuid4(),
        alert_id=alert_id_str,
        zone_id=zone_db_id,
        risk_evaluation_id=risk_evaluation_id,
        severity=severity,
        risk_score=dynamic_risk_score,
        status=AlertStatus.ACTIVE.value,
        trigger_reason=trigger_reason,
        provenance=provenance,
        created_at=now,
    )
    db.add(alert)
    await db.flush()

    # Append immutable audit history
    audit = AlertAuditHistoryModel(
        alert_id=alert.id,
        action="ALERT_GENERATED",
        operator_id="SYSTEM",
        notes=f"Dynamic risk score {dynamic_risk_score:.2f} crossed {severity} threshold.",
        timestamp=now,
    )
    db.add(audit)
    await db.commit()
    await db.refresh(alert)

    logger.info("Generated operational alert %s (%s)", alert_id_str, severity)
    return alert


async def acknowledge_alert(
    db: AsyncSession,
    alert_id: str,
    operator_id: str,
    notes: str,
) -> Optional[AlertModel]:
    """Acknowledge an active alert and record immutable operator audit history."""
    stmt = select(AlertModel).options(joinedload(AlertModel.zone)).where(AlertModel.alert_id == alert_id)
    alert = (await db.scalars(stmt)).first()

    if not alert:
        return None

    now = datetime.now(timezone.utc)
    alert.status = AlertStatus.ACKNOWLEDGED.value
    alert.acknowledged_at = now

    audit = AlertAuditHistoryModel(
        alert_id=alert.id,
        action="ALERT_ACKNOWLEDGED",
        operator_id=operator_id,
        notes=notes,
        timestamp=now,
    )
    db.add(audit)
    await db.commit()
    await db.refresh(alert)

    logger.info("Alert %s acknowledged by operator %s", alert_id, operator_id)
    return alert


async def get_alerts_paginated(
    db: AsyncSession,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    zone_id: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[AlertModel], int]:
    """Retrieve filtered, paginated alerts sorted with newest first."""
    stmt = select(AlertModel).options(joinedload(AlertModel.zone))

    if severity:
        stmt = stmt.where(AlertModel.severity == severity.strip().upper())

    if status:
        stmt = stmt.where(AlertModel.status == status.strip().upper())

    if zone_id:
        z_stmt = select(Zone.id).where(Zone.zone_id == zone_id)
        z_id = await db.scalar(z_stmt)
        if z_id:
            stmt = stmt.where(AlertModel.zone_id == z_id)
        else:
            return [], 0

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.scalar(count_stmt)) or 0

    stmt = stmt.order_by(AlertModel.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    alerts = (await db.scalars(stmt)).all()

    return list(alerts), total


async def get_alert_audit_trail(db: AsyncSession, alert_id: str) -> List[Tuple[AlertAuditHistoryModel, str]]:
    """Retrieve chronological audit trail for an alert along with the alert identifier string."""
    a_stmt = select(AlertModel).where(AlertModel.alert_id == alert_id)
    alert = (await db.scalars(a_stmt)).first()
    if not alert:
        return []

    stmt = (
        select(AlertAuditHistoryModel)
        .where(AlertAuditHistoryModel.alert_id == alert.id)
        .order_by(AlertAuditHistoryModel.timestamp.asc())
    )
    audits = (await db.scalars(stmt)).all()
    return [(aud, alert.alert_id) for aud in audits]
