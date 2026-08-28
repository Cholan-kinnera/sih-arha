"""Sensor Registry SQLAlchemy 2.x Model."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from apps.api.app.db.base import Base, TimestampMixin
from apps.api.app.db.types import DialectJSONB, PostGISGeometry


class SensorModel(Base, TimestampMixin):
    """Physical or virtual telemetry sensor registry."""

    __tablename__ = "sensors"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    sensor_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    zone_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid,
        ForeignKey("zones.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    source_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid,
        ForeignKey("data_sources.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    sensor_type: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="CONNECTED", nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # PostGIS POINT geometry (SRID 4326)
    geometry: Mapped[Optional[str]] = mapped_column(
        PostGISGeometry("POINT", srid=4326, spatial_index=True),
        nullable=True,
    )

    installed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    metadata_json: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        "metadata",
        DialectJSONB,
        nullable=True,
    )

    # Relationships
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="sensors")
    source: Mapped[Optional["DataSourceModel"]] = relationship("DataSourceModel", back_populates="sensors")
    telemetry_readings: Mapped[List["TelemetryReadingModel"]] = relationship(
        "TelemetryReadingModel",
        back_populates="sensor",
    )
