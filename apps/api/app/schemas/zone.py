"""Zone & Catchment Pydantic Schemas."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class TerrainSummary(BaseModel):
    """Zonal terrain summary for zone profile."""

    terrain_coverage: bool
    terrain_status: str
    mean_elevation_m: Optional[float] = None
    mean_slope_deg: Optional[float] = None
    mean_tri: Optional[float] = None
    provenance: str


class ZoneResponse(BaseModel):
    """Basic zone response model."""

    zone_id: str
    name: str
    state: str
    district: str
    subdivision: str
    is_ner: bool
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    historical_landslide_count: int
    historical_landslide_presence: int


class ZoneDetailResponse(ZoneResponse):
    """Exhaustive zone profile with terrain and risk telemetry context."""

    terrain: Optional[TerrainSummary] = None
    static_susceptibility_prior: Optional[float] = None
    current_dynamic_risk: Optional[float] = None
    current_severity: Optional[str] = None
    data_freshness: Optional[str] = None


class ZoneListResponse(BaseModel):
    """Paginated list of monitored zones."""

    total: int
    page: int
    page_size: int
    total_pages: int
    zones: List[ZoneResponse]
