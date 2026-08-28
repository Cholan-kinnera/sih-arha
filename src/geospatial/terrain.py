"""Terrain Derivatives Engine: Slope, Aspect, and Roughness Index calculations."""

from __future__ import annotations

import logging
from typing import Optional
import numpy as np
from scipy.ndimage import convolve

logger = logging.getLogger(__name__)


def compute_slope_degrees(
    dem: np.ndarray,
    dx: float = 30.0,
    dy: float = 30.0,
    nodata: Optional[float] = None,
) -> np.ndarray:
    """Compute terrain slope in degrees using Horn (1981) 8-neighborhood 2nd order finite difference.

    Formula:
        p = dz/dx = ((c + 2f + i) - (a + 2d + g)) / (8 * dx)
        q = dz/dy = ((g + 2h + i) - (a + 2b + c)) / (8 * dy)
        slope_deg = arctan(sqrt(p^2 + q^2)) * (180 / pi)
    """
    grid = dem.astype(float).copy()
    if nodata is not None:
        mask = (grid == nodata) | np.isnan(grid)
        grid[mask] = np.nan

    # Horn's kernels for dz/dx (horizontal) and dz/dy (vertical)
    kernel_x = np.array([
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ], dtype=float) / (8.0 * dx)

    kernel_y = np.array([
        [-1, -2, -1],
        [ 0,  0,  0],
        [ 1,  2,  1]
    ], dtype=float) / (8.0 * dy)

    p = convolve(grid, kernel_x, mode="reflect")
    q = convolve(grid, kernel_y, mode="reflect")

    rise_run = np.sqrt(p**2 + q**2)
    slope_rad = np.arctan(rise_run)
    slope_deg = np.degrees(slope_rad)

    # Edge reflection cleanup
    if nodata is not None:
        slope_deg[mask] = np.nan

    return np.clip(slope_deg, 0.0, 90.0)


def compute_aspect_degrees(
    dem: np.ndarray,
    dx: float = 30.0,
    dy: float = 30.0,
    nodata: Optional[float] = None,
) -> np.ndarray:
    """Compute terrain aspect in degrees (0 - 360 clockwise from North)."""
    grid = dem.astype(float).copy()
    if nodata is not None:
        mask = (grid == nodata) | np.isnan(grid)
        grid[mask] = np.nan

    kernel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=float) / (8.0 * dx)
    kernel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=float) / (8.0 * dy)

    p = convolve(grid, kernel_x, mode="reflect")
    q = convolve(grid, kernel_y, mode="reflect")

    aspect_rad = np.arctan2(p, -q)
    aspect_deg = np.degrees(aspect_rad)
    aspect_deg = np.where(aspect_deg < 0, aspect_deg + 360.0, aspect_deg)

    # Flat areas (slope == 0) have undefined / zero aspect
    flat_mask = (p == 0) & (q == 0)
    aspect_deg[flat_mask] = 0.0

    if nodata is not None:
        aspect_deg[mask] = np.nan

    return aspect_deg


def compute_terrain_roughness_index(
    dem: np.ndarray,
    nodata: Optional[float] = None,
) -> np.ndarray:
    """Compute Terrain Roughness Index (TRI) following Riley et al. (1999).

    TRI is the root-mean-square elevation difference between the central cell
    and its 8 neighboring cells:
        TRI = sqrt(sum((z_neighbor - z_center)^2) / 8)
    """
    grid = dem.astype(float).copy()
    if nodata is not None:
        mask = (grid == nodata) | np.isnan(grid)
        grid[mask] = np.nan

    pad = np.pad(grid, pad_width=1, mode="edge")
    sq_diff_sum = np.zeros_like(grid, dtype=float)

    # 8 neighbor offsets
    offsets = [
        (-1, -1), (-1, 0), (-1, 1),
        ( 0, -1),          ( 0, 1),
        ( 1, -1), ( 1, 0), ( 1, 1)
    ]

    for dy, dx in offsets:
        neighbor = pad[1 + dy : 1 + dy + grid.shape[0], 1 + dx : 1 + dx + grid.shape[1]]
        sq_diff_sum += (neighbor - grid) ** 2

    tri = np.sqrt(sq_diff_sum / 8.0)

    if nodata is not None:
        tri[mask] = np.nan

    return np.clip(tri, 0.0, None)
