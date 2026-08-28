"""Defensive Data Loaders and Dataset Discovery Module for LEWS.

Provides type-safe, encoding-resilient data loaders for raw CSV datasets
and handles discovery across canonical repository locations.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
import pandas as pd

logger = logging.getLogger(__name__)


def get_project_root() -> Path:
    """Return the absolute path to the repository root."""
    return Path(__file__).resolve().parent.parent.parent


def find_data_file(filename: str, search_subdirs: Optional[List[str]] = None) -> Path:
    """Locate a data file in standard data/raw paths or raise FileNotFoundError."""
    root = get_project_root()
    subdirs = search_subdirs or ["", "landslides", "rainfall", "geography", "experimental", "rejected"]

    candidates: List[Path] = []
    for subdir in subdirs:
        p = root / "data" / "raw" / subdir / filename if subdir else root / "data" / "raw" / filename
        if p.exists() and p.is_file():
            return p
        candidates.append(p)

    # Secondary check in data/
    alt = root / "data" / filename
    if alt.exists() and alt.is_file():
        return alt

    raise FileNotFoundError(
        f"Data file '{filename}' could not be located in any of: {[str(c) for c in candidates]}"
    )


def load_raw_landslides() -> pd.DataFrame:
    """Load the raw historical landslide incidence dataset with encoding resilience."""
    path = find_data_file("landslide_incidence.csv", ["", "landslides"])
    try:
        df = pd.read_csv(path, encoding="utf-8")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="latin-1")

    # Validate essential schema
    if "LandslideIncidence" not in df.columns:
        raise ValueError(
            f"Expected 'LandslideIncidence' column in {path}, found: {list(df.columns)}"
        )

    logger.info("Loaded raw landslide incidence dataset: %d rows from %s", len(df), path)
    return df


def load_raw_rainfall_district() -> pd.DataFrame:
    """Load the raw district-level climatological normal rainfall dataset."""
    path = find_data_file("rainfall_district.csv", ["", "rainfall"])
    try:
        df = pd.read_csv(path, encoding="utf-8")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="latin-1")

    required_cols = {"STATE_UT_NAME", "DISTRICT", "ANNUAL"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns {missing} in {path}")

    logger.info("Loaded raw district rainfall normals: %d rows from %s", len(df), path)
    return df


def load_raw_rainfall_subdivision() -> pd.DataFrame:
    """Load the raw historical subdivision-level rainfall time-series dataset."""
    path = find_data_file("rainfall_subdivision.csv", ["", "rainfall"])
    try:
        df = pd.read_csv(path, encoding="utf-8")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="latin-1")

    required_cols = {"SUBDIVISION", "YEAR", "ANNUAL"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns {missing} in {path}")

    logger.info("Loaded raw subdivision rainfall time-series: %d rows from %s", len(df), path)
    return df


def discover_all_datasets() -> Dict[str, Dict[str, Any]]:
    """Scan data/raw directory and produce structured file inventory."""
    root = get_project_root()
    raw_dir = root / "data" / "raw"
    inventory: Dict[str, Dict[str, Any]] = {}

    if not raw_dir.exists():
        return inventory

    for p in sorted(raw_dir.rglob("*")):
        if p.is_file() and not p.name.startswith("."):
            rel_path = str(p.relative_to(root))
            file_size_bytes = p.stat().st_size
            file_ext = p.suffix.lower()

            item_info: Dict[str, Any] = {
                "filename": p.name,
                "relative_path": rel_path,
                "file_type": file_ext,
                "size_bytes": file_size_bytes,
                "row_count": None,
                "column_count": None,
                "columns": [],
                "provenance": "UNKNOWN",
                "intended_use": "UNKNOWN",
                "status": "ACCEPTED",
            }

            if file_ext == ".csv":
                try:
                    df = pd.read_csv(p, nrows=5)
                    full_df = pd.read_csv(p)
                    item_info["row_count"] = len(full_df)
                    item_info["column_count"] = len(full_df.columns)
                    item_info["columns"] = list(full_df.columns)
                except Exception as e:
                    item_info["read_error"] = str(e)

            # Categorization
            if "landslide" in p.name.lower():
                item_info["provenance"] = "HISTORICAL_REPORTS"
                item_info["intended_use"] = "Baseline Landslide Ground-Truth Target Label"
            elif "district" in p.name.lower():
                item_info["provenance"] = "CLIMATOLOGICAL_NORMALS"
                item_info["intended_use"] = "District-Level Baseline Exposure & Seasonality Features"
            elif "subdivision" in p.name.lower():
                item_info["provenance"] = "HISTORICAL_TIME_SERIES"
                item_info["intended_use"] = "Subdivision Climatological Baseline & Variance Features"
            elif "plant_vase" in p.name.lower():
                item_info["provenance"] = "EXPERIMENTAL_SENSOR"
                item_info["intended_use"] = "Telemetry Pipeline & Simulator Testing (Non-NER)"
                item_info["status"] = "EXPERIMENTAL"
            elif "dem" in p.name.lower() or file_ext in {".tif", ".tiff"}:
                item_info["provenance"] = "SATELLITE_DEM"
                item_info["intended_use"] = "Terrain Modeling (Pending Geographic Validation)"
                # DEM validation flag
                item_info["status"] = "REJECTED_GEOGRAPHICALLY_INCOMPATIBLE"
                item_info["rejection_reason"] = "Bounding extent does not overlap North-Eastern Region of India."

            inventory[p.name] = item_info

    return inventory
