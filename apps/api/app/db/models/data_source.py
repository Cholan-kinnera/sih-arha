"""Data Source Registry and Ingestion Event SQLAlchemy 2.x Models."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import BigInteger, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from apps.api.app.db.base import Base, TimestampMixin
from apps.api.app.db.types import DialectJSONB


class DataSourceModel(Base, TimestampMixin):
    """Observational data source lineage and registry record."""

    __tablename__ = "data_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    source_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    provider: Mapped[str] = mapped_column(String(64), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="CONNECTED", nullable=False)
    freshness: Mapped[str] = mapped_column(String(32), default="FRESH", nullable=False)
    provenance: Mapped[str] = mapped_column(String(32), default="HISTORICAL", nullable=False)
    cadence: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    last_ingested_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    record_count: Mapped[Optional[int]] = mapped_column(Integer, default=0, nullable=True)
    metadata_json: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        "metadata",
        DialectJSONB,
        nullable=True,
    )

    # Relationships
    sensors: Mapped[List["SensorModel"]] = relationship(
        "SensorModel",
        back_populates="source",
    )
    ingestion_events: Mapped[List["IngestionEventModel"]] = relationship(
        "IngestionEventModel",
        back_populates="source",
        cascade="all, delete-orphan",
    )


class IngestionEventModel(Base):
    """Audit log of observational pipeline ingestion runs."""

    __tablename__ = "ingestion_events"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        primary_key=True,
        autoincrement=True,
    )
    source_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("data_sources.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    records_ingested: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    duration_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    provenance: Mapped[str] = mapped_column(String(32), default="HISTORICAL", nullable=False)
    metadata_json: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        "metadata",
        DialectJSONB,
        nullable=True,
    )

    source: Mapped["DataSourceModel"] = relationship("DataSourceModel", back_populates="ingestion_events")

    __table_args__ = (
        Index("ix_ingestion_source_started", "source_id", started_at.desc()),
        Index("ix_ingestion_status_started", "status", started_at.desc()),
    )
