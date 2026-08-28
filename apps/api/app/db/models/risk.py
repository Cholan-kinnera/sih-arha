"""Risk Evaluation SQLAlchemy 2.x Model."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import BigInteger, Boolean, CheckConstraint, DateTime, Float, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from apps.api.app.db.base import Base
from apps.api.app.db.types import DialectJSONB


class RiskEvaluationModel(Base):
    """Immutable historical record of DynamicRiskEngine evaluations."""

    __tablename__ = "risk_evaluations"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        primary_key=True,
        autoincrement=True,
    )
    zone_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("zones.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    static_susceptibility: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    terrain_factor: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rainfall_factor: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    soil_factor: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    historical_factor: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    dynamic_risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    provenance: Mapped[str] = mapped_column(String(32), default="SIMULATED", nullable=False, index=True)
    degraded_mode: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    degraded_reasons: Mapped[Optional[Dict[str, Any]]] = mapped_column(DialectJSONB, nullable=True)
    model_version: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    evidence: Mapped[Dict[str, Any]] = mapped_column(DialectJSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    zone: Mapped["Zone"] = relationship("Zone", back_populates="risk_evaluations")
    alerts: Mapped[List["AlertModel"]] = relationship(
        "AlertModel",
        back_populates="risk_evaluation",
    )

    __table_args__ = (
        CheckConstraint("dynamic_risk_score >= 0.0 AND dynamic_risk_score <= 1.0", name="chk_dynamic_risk_bounds"),
        Index("ix_risk_zone_timestamp", "zone_id", timestamp.desc()),
        Index("ix_risk_severity_timestamp", "severity", timestamp.desc()),
        Index("ix_risk_provenance", "provenance"),
    )
