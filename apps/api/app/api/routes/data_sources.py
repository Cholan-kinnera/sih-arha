"""Data Source Ingestion Registry Routes (Async)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.session import get_async_db
from apps.api.app.schemas.data_source import (
    DataSourceListResponse,
    DataSourceResponse,
)
from apps.api.app.services.data_source_service import (
    get_all_data_sources,
    get_data_source_by_id,
)

router = APIRouter(prefix="/sources", tags=["Data Sources"])


@router.get(
    "",
    response_model=DataSourceListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all registered data sources and telemetry feeds",
)
async def list_data_sources(db: AsyncSession = Depends(get_async_db)) -> DataSourceListResponse:
    """Retrieve catalog of observational, climatological, and physical telemetry sources."""
    sources = await get_all_data_sources(db=db)
    return DataSourceListResponse(total=len(sources), sources=sources)


@router.get(
    "/{source_id}",
    response_model=DataSourceResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve detailed metadata for single data source",
)
async def get_single_data_source(
    source_id: str,
    db: AsyncSession = Depends(get_async_db),
) -> DataSourceResponse:
    """Retrieve data source configuration, ingestion health, and provenance metadata."""
    source = await get_data_source_by_id(db=db, source_id=source_id)
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data source '{source_id}' not found.",
        )
    return source
