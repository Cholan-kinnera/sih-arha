"""Custom SQLAlchemy Types for PostGIS Geometry and JSONB dialect compatibility."""

from __future__ import annotations

from typing import Any, Optional
from geoalchemy2 import Geometry
from sqlalchemy import JSON, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import TypeDecorator


class PostGISGeometry(TypeDecorator):
    """PostGIS Geometry type that emits native Geometry on PostgreSQL and Text on SQLite."""

    impl = Geometry
    cache_ok = True

    def __init__(self, geometry_type: str = "GEOMETRY", srid: int = 4326, spatial_index: bool = False, **kwargs: Any):
        self.geometry_type = geometry_type
        self.srid = srid
        self.spatial_index = spatial_index
        super().__init__(geometry_type=geometry_type, srid=srid, spatial_index=spatial_index, **kwargs)

    def load_dialect_impl(self, dialect: Optional[Any] = None) -> Any:
        if dialect is None or dialect.name == "postgresql":
            return dialect.type_descriptor(
                Geometry(geometry_type=self.geometry_type, srid=self.srid, spatial_index=self.spatial_index)
            ) if dialect is not None else Geometry(geometry_type=self.geometry_type, srid=self.srid, spatial_index=self.spatial_index)
        return dialect.type_descriptor(String())


class DialectJSONB(TypeDecorator):
    """JSONB on PostgreSQL, standard JSON on other dialects like SQLite."""

    impl = JSON
    cache_ok = True

    def load_dialect_impl(self, dialect: Optional[Any] = None) -> Any:
        if dialect is not None and dialect.name == "postgresql":
            return dialect.type_descriptor(JSONB())
        return dialect.type_descriptor(JSON()) if dialect is not None else JSON()
