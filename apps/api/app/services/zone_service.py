"""Zone Management & Query Orchestration Service (Async)."""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from apps.api.app.db.models.risk import RiskEvaluationModel
from apps.api.app.db.models.zone import Zone, ZoneTerrainFeatures
from apps.api.app.schemas.zone import TerrainSummary, ZoneDetailResponse, ZoneResponse

logger = logging.getLogger(__name__)


async def get_zones_paginated(
    db: AsyncSession,
    search: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    is_ner: Optional[bool] = None,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[ZoneResponse], int]:
    """Retrieve filtered, paginated list of monitored zones with deterministic ordering."""
    stmt = select(Zone)

    if search:
        pattern = f"%{search.strip().upper()}%"
        stmt = stmt.where(
            or_(
                func.upper(Zone.name).like(pattern),
                func.upper(Zone.district).like(pattern),
                func.upper(Zone.state).like(pattern),
                func.upper(Zone.zone_id).like(pattern),
            )
        )

    if state:
        stmt = stmt.where(func.upper(Zone.state) == state.strip().upper())

    if district:
        stmt = stmt.where(func.upper(Zone.district) == district.strip().upper())

    if is_ner is not None:
        stmt = stmt.where(Zone.is_ner == is_ner)

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.scalar(count_stmt)) or 0

    # Deterministic sorting
    stmt = stmt.order_by(Zone.is_ner.desc(), Zone.state.asc(), Zone.district.asc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    zones = (await db.scalars(stmt)).all()

    zone_responses = [
        ZoneResponse(
            zone_id=z.zone_id,
            name=z.name,
            state=z.state,
            district=z.district,
            subdivision=z.subdivision or "UNSPECIFIED",
            is_ner=z.is_ner,
            latitude=None,
            longitude=None,
            historical_landslide_count=0,
            historical_landslide_presence=0,
        )
        for z in zones
    ]

    return zone_responses, total


async def get_zone_detail(db: AsyncSession, zone_id: str) -> Optional[ZoneDetailResponse]:
    """Retrieve detailed zone profile including terrain features and current risk telemetry."""
    stmt = select(Zone).options(joinedload(Zone.terrain)).where(Zone.zone_id == zone_id)
    zone = (await db.scalars(stmt)).first()

    if not zone:
        return None

    # Terrain summary
    terrain_summary = None
    if zone.terrain:
        terrain_summary = TerrainSummary(
            terrain_coverage=zone.terrain.terrain_coverage,
            terrain_status="AVAILABLE" if zone.terrain.terrain_coverage else "UNAVAILABLE",
            mean_elevation_m=zone.terrain.elevation_mean,
            mean_slope_deg=zone.terrain.slope_mean,
            mean_tri=zone.terrain.tri_mean,
            provenance=zone.terrain.source_provenance,
        )

    # Latest risk evaluation
    latest_risk_stmt = (
        select(RiskEvaluationModel)
        .where(RiskEvaluationModel.zone_id == zone.id)
        .order_by(RiskEvaluationModel.timestamp.desc())
        .limit(1)
    )
    latest_risk = (await db.scalars(latest_risk_stmt)).first()

    return ZoneDetailResponse(
        zone_id=zone.zone_id,
        name=zone.name,
        state=zone.state,
        district=zone.district,
        subdivision=zone.subdivision or "UNSPECIFIED",
        is_ner=zone.is_ner,
        latitude=None,
        longitude=None,
        historical_landslide_count=0,
        historical_landslide_presence=0,
        terrain=terrain_summary,
        static_susceptibility_prior=latest_risk.static_susceptibility if latest_risk else None,
        current_dynamic_risk=latest_risk.dynamic_risk_score if latest_risk else None,
        current_severity=latest_risk.severity if latest_risk else None,
        data_freshness=latest_risk.provenance if latest_risk else None,
    )
