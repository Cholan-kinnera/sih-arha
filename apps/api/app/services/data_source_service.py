"""Data Source Registry Service (Async)."""

from __future__ import annotations

import logging
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.models.data_source import DataSourceModel
from apps.api.app.schemas.data_source import DataSourceResponse

logger = logging.getLogger(__name__)


async def get_all_data_sources(db: AsyncSession) -> List[DataSourceResponse]:
    """Retrieve all configured data sources."""
    stmt = select(DataSourceModel).order_by(DataSourceModel.category.asc(), DataSourceModel.name.asc())
    sources = (await db.scalars(stmt)).all()

    return [
        DataSourceResponse(
            source_id=s.source_id,
            name=s.name,
            provider=s.provider,
            category=s.category,
            status=s.status,
            freshness=s.freshness,
            provenance=s.provenance,
            cadence=s.cadence,
            last_ingested_at=s.last_ingested_at,
            record_count=s.record_count,
            metadata_json=s.metadata_json,
        )
        for s in sources
    ]


async def get_data_source_by_id(db: AsyncSession, source_id: str) -> Optional[DataSourceResponse]:
    """Retrieve details for a single data source."""
    stmt = select(DataSourceModel).where(DataSourceModel.source_id == source_id)
    s = (await db.scalars(stmt)).first()
    if not s:
        return None

    return DataSourceResponse(
        source_id=s.source_id,
        name=s.name,
        provider=s.provider,
        category=s.category,
        status=s.status,
        freshness=s.freshness,
        provenance=s.provenance,
        cadence=s.cadence,
        last_ingested_at=s.last_ingested_at,
        record_count=s.record_count,
        metadata_json=s.metadata_json,
    )
