"""Telemetry Reading SQLAlchemy 2.x Model."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy import BigInteger, DateTime, Float, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from apps.api.app.db.base import Base
from apps.api.app.db.types import DialectJSONB


class TelemetryReadingModel(Base):
    """Time-series observational sensor telemetry reading."""

    __tablename__ = "telemetry_readings"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        primary_key=True,
        autoincrement=True,
    )
    sensor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid,
        ForeignKey("sensors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    zone_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid,
        ForeignKey("zones.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    measurement_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(32), nullable=False)
    provenance: Mapped[str] = mapped_column(String(32), default="SIMULATED", nullable=False, index=True)
    metadata_json: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        "metadata",
        DialectJSONB,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    sensor: Mapped[Optional["SensorModel"]] = relationship("SensorModel", back_populates="telemetry_readings")

    __table_args__ = (
        Index("ix_telemetry_zone_timestamp", "zone_id", timestamp.desc()),
        Index("ix_telemetry_sensor_timestamp", "sensor_id", timestamp.desc()),
        Index("ix_telemetry_type_timestamp", "measurement_type", timestamp.desc()),
        Index("ix_telemetry_provenance", "provenance"),
    )
