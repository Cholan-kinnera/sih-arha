"""Raster Dataset Loader & Geospatial Grid Validator for LEWS."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import rasterio
from rasterio.transform import Affine

from src.data.loaders import get_project_root
from src.geospatial.crs import degrees_to_meters, is_in_ner

logger = logging.getLogger(__name__)


class DEMRaster:
    """Encapsulates a Digital Elevation Model raster grid with spatial metadata."""

    def __init__(
        self,
        data: np.ndarray,
        bounds: Tuple[float, float, float, float],  # (min_lon, min_lat, max_lon, max_lat)
        crs: str = "EPSG:4326",
        nodata: Optional[float] = None,
        res_deg: Tuple[float, float] = (0.000277, 0.000277),  # ~30m in degrees
    ):
        self.data = data
        self.bounds = bounds  # (min_lon, min_lat, max_lon, max_lat)
        self.crs = crs
        self.nodata = nodata
        self.res_deg = res_deg

        center_lat = (bounds[1] + bounds[3]) / 2.0
        self.dx_m, self.dy_m = degrees_to_meters(center_lat, res_deg[0], res_deg[1])

    @classmethod
    def from_file(cls, file_path: Path) -> "DEMRaster":
        """Load a DEM raster from a GeoTIFF file using rasterio."""
        if not file_path.exists():
            raise FileNotFoundError(f"DEM raster file not found: {file_path}")

        with rasterio.open(file_path) as src:
            data = src.read(1)
            bounds = (src.bounds.left, src.bounds.bottom, src.bounds.right, src.bounds.top)
            crs_str = str(src.crs) if src.crs else "EPSG:4326"
            nodata = src.nodata
            res_deg = (abs(src.res[0]), abs(src.res[1]))

        logger.info(
            "Loaded DEM raster from %s (Shape: %s, Bounds: %s, CRS: %s)",
            file_path.name,
            data.shape,
            bounds,
            crs_str,
        )
        return cls(data=data, bounds=bounds, crs=crs_str, nodata=nodata, res_deg=res_deg)

    @property
    def is_ner_compatible(self) -> bool:
        """Check if raster bounding box overlaps with North-Eastern Region."""
        min_lon, min_lat, max_lon, max_lat = self.bounds
        center_lat = (min_lat + max_lat) / 2.0
        center_lon = (min_lon + max_lon) / 2.0
        return is_in_ner(center_lat, center_lon)


def discover_dem_rasters(search_dir: Optional[Path] = None) -> List[Path]:
    """Scan raw directories for valid Digital Elevation Model GeoTIFF files."""
    root = get_project_root()
    search_dirs = [
        search_dir or (root / "data" / "raw" / "terrain"),
        root / "data" / "raw" / "dem",
        root / "data" / "raw",
    ]

    found_files: List[Path] = []
    for d in search_dirs:
        if d.exists():
            for f in sorted(list(d.glob("*.tif")) + list(d.glob("*.tiff"))):
                # Exclude explicitly rejected non-NER files
                if "dem_s_1s_clip" not in f.name:
                    found_files.append(f)

    return found_files
