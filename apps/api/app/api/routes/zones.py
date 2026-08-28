"""Monitored Landslide Zones Routes (Async)."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.session import get_async_db
from apps.api.app.schemas.zone import ZoneDetailResponse, ZoneListResponse
from apps.api.app.services.zone_service import get_zone_detail, get_zones_paginated

router = APIRouter(prefix="/zones", tags=["Zones"])


@router.get(
    "",
    response_model=ZoneListResponse,
    status_code=status.HTTP_200_OK,
    summary="List monitored zones with filtering and pagination",
)
async def list_zones(
    search: Optional[str] = Query(None, description="Search term across name, district, state, zone_id"),
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    district: Optional[str] = Query(None, description="Filter by District"),
    is_ner: Optional[bool] = Query(None, description="Filter to North-Eastern Region (NER) districts"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_async_db),
) -> ZoneListResponse:
    """Retrieve filtered, paginated catalog of canonical monitored landslide zones."""
    zones, total = await get_zones_paginated(
        db=db,
        search=search,
        state=state,
        district=district,
        is_ner=is_ner,
        page=page,
        page_size=page_size,
    )

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return ZoneListResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=pages,
        zones=zones,
    )


@router.get(
    "/{zone_id}",
    response_model=ZoneDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single zone detailed profile",
)
async def get_single_zone(
    zone_id: str,
    db: AsyncSession = Depends(get_async_db),
) -> ZoneDetailResponse:
    """Retrieve full zone profile including static terrain characteristics and latest risk prior."""
    detail = await get_zone_detail(db=db, zone_id=zone_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zone with identifier '{zone_id}' not found.",
        )
    return detail
