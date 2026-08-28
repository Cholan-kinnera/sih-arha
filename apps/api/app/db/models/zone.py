"""Zone and Terrain Feature SQLAlchemy 2.x Models."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from apps.api.app.db.base import Base, TimestampMixin
from apps.api.app.db.types import PostGISGeometry


class Zone(Base, TimestampMixin):
    """Canonical monitored geographic catchment zone."""

    __tablename__ = "zones"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    zone_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    state: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    district: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    subdivision: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    is_ner: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    # PostGIS MULTIPOLYGON geometry (SRID 4326)
    geometry: Mapped[Optional[str]] = mapped_column(
        PostGISGeometry("MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=True,
    )

    # Relationships
    terrain: Mapped[Optional["ZoneTerrainFeatures"]] = relationship(
        "ZoneTerrainFeatures",
        back_populates="zone",
        uselist=False,
        cascade="all, delete-orphan",
    )
    sensors: Mapped[List["SensorModel"]] = relationship(
        "SensorModel",
        back_populates="zone",
        cascade="all, delete-orphan",
    )
    risk_evaluations: Mapped[List["RiskEvaluationModel"]] = relationship(
        "RiskEvaluationModel",
        back_populates="zone",
        cascade="all, delete-orphan",
    )
    alerts: Mapped[List["AlertModel"]] = relationship(
        "AlertModel",
        back_populates="zone",
        cascade="all, delete-orphan",
    )


class ZoneTerrainFeatures(Base):
    """Static zonal terrain intelligence derived from DEM rasters."""

    __tablename__ = "zone_terrain_features"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    zone_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("zones.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    # Elevation metrics (meters)
    elevation_mean: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    elevation_min: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    elevation_max: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    elevation_std: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Slope metrics (degrees)
    slope_mean: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    slope_min: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    slope_max: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    slope_std: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Aspect & Terrain Roughness Index
    aspect_mean: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    tri_mean: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    terrain_coverage: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    source_provenance: Mapped[str] = mapped_column(String(64), default="TERRAIN_UNAVAILABLE", nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    zone: Mapped["Zone"] = relationship("Zone", back_populates="terrain")
