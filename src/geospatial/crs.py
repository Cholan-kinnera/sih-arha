"""Coordinate Reference System (CRS) & Spatial Metric Utilities for LEWS Geospatial."""

from __future__ import annotations

import math
from typing import Tuple

# WGS84 Constants
WGS84_A = 6378137.0  # Equatorial radius in meters
WGS84_B = 6356752.314245  # Polar radius in meters

# North-Eastern Region (NER) Bounding Box [lat_min, lat_max], [lon_min, lon_max]
NER_BOUNDS = {
    "lat_min": 21.5,
    "lat_max": 30.0,
    "lon_min": 87.5,
    "lon_max": 97.5,
}

INDIA_BOUNDS = {
    "lat_min": 6.0,
    "lat_max": 37.5,
    "lon_min": 68.0,
    "lon_max": 98.0,
}


def is_in_ner(lat: float, lon: float) -> bool:
    """Check if coordinates fall within North-Eastern Region bounding box."""
    return (
        NER_BOUNDS["lat_min"] <= lat <= NER_BOUNDS["lat_max"]
        and NER_BOUNDS["lon_min"] <= lon <= NER_BOUNDS["lon_max"]
    )


def is_in_india(lat: float, lon: float) -> bool:
    """Check if coordinates fall within mainland India bounding box."""
    return (
        INDIA_BOUNDS["lat_min"] <= lat <= INDIA_BOUNDS["lat_max"]
        and INDIA_BOUNDS["lon_min"] <= lon <= INDIA_BOUNDS["lon_max"]
    )


def degrees_to_meters(lat_deg: float, res_deg_x: float, res_deg_y: float) -> Tuple[float, float]:
    """Convert grid cell resolution from geographic degrees to ground meters.

    Uses spherical approximation at given latitude:
    dx = 111320.0 * cos(lat) * res_x
    dy = 110540.0 * res_y
    """
    lat_rad = math.radians(lat_deg)
    dx = abs(111320.0 * math.cos(lat_rad) * res_deg_x)
    dy = abs(110540.0 * res_deg_y)
    return max(dx, 1.0), max(dy, 1.0)
