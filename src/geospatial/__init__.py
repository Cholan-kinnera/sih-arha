"""Geospatial Terrain Intelligence & Zonal Analysis Package for LEWS."""

from src.geospatial.crs import degrees_to_meters, is_in_india, is_in_ner
from src.geospatial.raster import DEMRaster, discover_dem_rasters
from src.geospatial.terrain import (
    compute_aspect_degrees,
    compute_slope_degrees,
    compute_terrain_roughness_index,
)
from src.geospatial.zonal import extract_zonal_terrain_features

__all__ = [
    "degrees_to_meters",
    "is_in_india",
    "is_in_ner",
    "DEMRaster",
    "discover_dem_rasters",
    "compute_aspect_degrees",
    "compute_slope_degrees",
    "compute_terrain_roughness_index",
    "extract_zonal_terrain_features",
]
