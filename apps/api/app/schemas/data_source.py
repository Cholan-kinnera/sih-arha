"""Data Source Registry Pydantic Schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class DataSourceResponse(BaseModel):
    """Data source catalog record response."""

    source_id: str
    name: str
    provider: str
    category: str
    status: str
    freshness: str
    provenance: str
    cadence: str
    last_ingested_at: Optional[datetime] = None
    record_count: int
    metadata_json: Optional[Dict[str, Any]] = None


class DataSourceListResponse(BaseModel):
    """List of configured ingestion data sources."""

    total: int
    sources: List[DataSourceResponse]
