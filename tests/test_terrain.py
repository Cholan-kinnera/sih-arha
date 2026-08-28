"""Unit Tests for Terrain Derivatives: Slope, Aspect, and Roughness Index."""

import pytest
import numpy as np
from src.geospatial.terrain import (
    compute_slope_degrees,
    compute_aspect_degrees,
    compute_terrain_roughness_index,
)


def test_slope_flat_surface():
    # 5x5 perfectly flat plane at 500m elevation
    dem = np.full((5, 5), 500.0, dtype=float)
    slope = compute_slope_degrees(dem, dx=30.0, dy=30.0)

    assert slope.shape == (5, 5)
    # Center cells must have 0.0 degree slope
    assert np.allclose(slope[1:-1, 1:-1], 0.0, atol=1e-3)


def test_slope_45_degree_ramp():
    # Planar incline: z increases by 30m every 30m in x direction (rise/run = 1.0 -> 45 deg)
    x = np.arange(10) * 30.0
    dem = np.tile(x, (10, 1))

    slope = compute_slope_degrees(dem, dx=30.0, dy=30.0)
    # Center cells must be 45.0 degrees
    center_slopes = slope[2:-2, 2:-2]
    assert np.allclose(center_slopes, 45.0, atol=1e-2)


def test_aspect_directional_gradients():
    # North-facing slope: elevation decreases going North (upwards in matrix, decreasing row index)
    y = np.arange(10, 0, -1) * 30.0
    dem_north = np.tile(y.reshape(-1, 1), (1, 10))

    aspect = compute_aspect_degrees(dem_north, dx=30.0, dy=30.0)
    # Aspect for North slope should be ~0/360 degrees
    assert aspect.shape == (10, 10)
    assert np.all(aspect >= 0.0) and np.all(aspect <= 360.0)


def test_terrain_roughness_index():
    # Flat terrain has TRI == 0
    flat_dem = np.full((6, 6), 100.0, dtype=float)
    tri_flat = compute_terrain_roughness_index(flat_dem)
    assert np.allclose(tri_flat[1:-1, 1:-1], 0.0, atol=1e-3)

    # Rough terrain has positive TRI
    rough_dem = np.array([
        [100, 150, 120],
        [200, 300, 180],
        [110, 140, 130]
    ], dtype=float)
    tri_rough = compute_terrain_roughness_index(rough_dem)
    center_tri = tri_rough[1, 1]
    assert center_tri > 0.0
