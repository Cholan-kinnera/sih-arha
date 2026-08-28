"""Alert & Immutable Audit History SQLAlchemy 2.x Models."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import BigInteger, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from apps.api.app.db.base import Base


class AlertModel(Base):
    """Operational hazard alert records generated upon dynamic risk threshold crossings."""

    __tablename__ = "alerts"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    alert_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    zone_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("zones.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    risk_evaluation_id: Mapped[Optional[int]] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("risk_evaluations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    severity: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    trigger_reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE", nullable=False, index=True)
    provenance: Mapped[str] = mapped_column(String(32), default="SIMULATED", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    zone: Mapped["Zone"] = relationship("Zone", back_populates="alerts")
    risk_evaluation: Mapped[Optional["RiskEvaluationModel"]] = relationship(
        "RiskEvaluationModel",
        back_populates="alerts",
    )
    audit_history: Mapped[List["AlertAuditHistoryModel"]] = relationship(
        "AlertAuditHistoryModel",
        back_populates="alert",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_alerts_zone_created", "zone_id", created_at.desc()),
        Index("ix_alerts_status_severity", "status", "severity"),
        Index("ix_alerts_created_at_desc", created_at.desc()),
    )


class AlertAuditHistoryModel(Base):
    """Immutable, append-only chronological audit trail of operator actions taken on an alert."""

    __tablename__ = "alert_audit_history"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        primary_key=True,
        autoincrement=True,
    )
    alert_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("alerts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    operator_id: Mapped[str] = mapped_column(String(64), nullable=False)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    alert: Mapped["AlertModel"] = relationship("AlertModel", back_populates="audit_history")

    __table_args__ = (
        Index("ix_alert_audit_alert_time", "alert_id", timestamp.desc()),
    )
