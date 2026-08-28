#!/usr/bin/env python3
"""Data Inspection & Quality Profiling Script for LEWS.

Profiles all raw datasets in data/raw/ and generates:
- data/reports/dataset_inventory.json
- data/reports/dataset_inventory.md
- data/reports/data_quality_report.json
- data/reports/data_quality_report.md
"""

from __future__ import annotations

import json
import logging
import sys
from pathlib import Path
from typing import Any, Dict, List

# Ensure repository root is in pythonpath
_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

import pandas as pd

from src.data.geography import GeographyNormalizer
from src.data.loaders import discover_all_datasets, get_project_root

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def generate_data_quality_reports() -> None:
    """Scan raw datasets and write comprehensive inventory & quality reports."""
    root = get_project_root()
    reports_dir = root / "data" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    # 1. Discover Inventory
    inventory = discover_all_datasets()

    inventory_json_path = reports_dir / "dataset_inventory.json"
    with open(inventory_json_path, "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=2)
    logger.info("Wrote dataset inventory to %s", inventory_json_path)

    # 2. Markdown Inventory
    inventory_md_path = reports_dir / "dataset_inventory.md"
    with open(inventory_md_path, "w", encoding="utf-8") as f:
        f.write("# LEWS — Raw Dataset Master Inventory\n\n")
        f.write("Generated automatically by `scripts/inspect_data.py`.\n\n")
        f.write("| Dataset File | Type | Rows | Cols | Size (KB) | Status | Provenance | Intended Role |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")

        for name, item in inventory.items():
            f.write(
                f"| `{item['filename']}` | `{item['file_type']}` | "
                f"{item.get('row_count', 'N/A')} | {item.get('column_count', 'N/A')} | "
                f"{item['size_bytes'] / 1024:.1f} | **{item.get('status', 'ACCEPTED')}** | "
                f"`{item.get('provenance', 'UNKNOWN')}` | {item.get('intended_use', 'N/A')} |\n"
            )

        f.write("\n## Known Rejections & Geospatial Boundaries\n\n")
        f.write("- **`dem_s_1s_clip.tif`**: If present, rejected because extent (approx 139°E–149°E, 27°S–19°S) is outside North-Eastern India.\n")
        f.write("- **`plant_vase*.CSV`**: If present, classified as `EXPERIMENTAL / NON-NER SENSOR DATA` and isolated from baseline ML dataset.\n")

    logger.info("Wrote dataset inventory markdown to %s", inventory_md_path)

    # 3. Deep Profiling for Data Quality Report
    quality_data: Dict[str, Any] = {}

    # Landslides
    ls_path = root / "data" / "raw" / "landslide_incidence.csv"
    if not ls_path.exists():
        ls_path = root / "data" / "raw" / "landslides" / "landslide_incidence.csv"
    if ls_path.exists():
        df_ls = pd.read_csv(ls_path)
        quality_data["landslide_incidence"] = {
            "path": str(ls_path.relative_to(root)),
            "row_count": len(df_ls),
            "column_count": len(df_ls.columns),
            "columns": list(df_ls.columns),
            "missing_values": {str(k): int(v) for k, v in df_ls.isnull().sum().items()},
            "duplicates": int(df_ls.duplicated().sum()),
            "provenance": "GSI Historical Incidents (2016-2020)",
            "limitations": "Text-based narratives require parsing for date, coordinates, state, and district.",
        }

    # District Rainfall
    dist_path = root / "data" / "raw" / "rainfall_district.csv"
    if not dist_path.exists():
        dist_path = root / "data" / "raw" / "rainfall" / "rainfall_district.csv"
    if dist_path.exists():
        df_dist = pd.read_csv(dist_path)
        quality_data["rainfall_district"] = {
            "path": str(dist_path.relative_to(root)),
            "row_count": len(df_dist),
            "column_count": len(df_dist.columns),
            "columns": list(df_dist.columns),
            "missing_values": {str(k): int(v) for k, v in df_dist.isnull().sum().items()},
            "duplicates": int(df_dist.duplicated().sum()),
            "states_count": int(df_dist["STATE_UT_NAME"].nunique()),
            "annual_rainfall_min_mm": float(df_dist["ANNUAL"].min()),
            "annual_rainfall_max_mm": float(df_dist["ANNUAL"].max()),
            "annual_rainfall_mean_mm": float(df_dist["ANNUAL"].mean()),
            "provenance": "IMD District-Wise Climatological Rainfall Normals",
            "limitations": "Represents long-term climatological normal precipitation, not event-specific trigger downpours.",
        }

    # Subdivision Rainfall
    sub_path = root / "data" / "raw" / "rainfall_subdivision.csv"
    if not sub_path.exists():
        sub_path = root / "data" / "raw" / "rainfall" / "rainfall_subdivision.csv"
    if sub_path.exists():
        df_sub = pd.read_csv(sub_path)
        quality_data["rainfall_subdivision"] = {
            "path": str(sub_path.relative_to(root)),
            "row_count": len(df_sub),
            "column_count": len(df_sub.columns),
            "columns": list(df_sub.columns),
            "missing_values": {str(k): int(v) for k, v in df_sub.isnull().sum().items()},
            "duplicates": int(df_sub.duplicated().sum()),
            "subdivisions_count": int(df_sub["SUBDIVISION"].nunique()),
            "year_min": int(df_sub["YEAR"].min()),
            "year_max": int(df_sub["YEAR"].max()),
            "provenance": "IMD Subdivision-Wise Historical Rainfall Time-Series (1901-2015)",
            "limitations": "Broad spatial meteorological aggregation covering multiple districts.",
        }

    quality_json_path = reports_dir / "data_quality_report.json"
    with open(quality_json_path, "w", encoding="utf-8") as f:
        json.dump(quality_data, f, indent=2)
    logger.info("Wrote data quality JSON to %s", quality_json_path)

    # 4. Markdown Quality Report
    quality_md_path = reports_dir / "data_quality_report.md"
    with open(quality_md_path, "w", encoding="utf-8") as f:
        f.write("# LEWS — Comprehensive Data Quality & Profiling Report\n\n")
        f.write("Generated automatically by `scripts/inspect_data.py`.\n\n")

        for ds_name, info in quality_data.items():
            f.write(f"## Dataset: `{ds_name}`\n\n")
            f.write(f"- **Path**: `{info['path']}`\n")
            f.write(f"- **Dimensions**: {info['row_count']} rows × {info['column_count']} columns\n")
            f.write(f"- **Duplicates**: {info['duplicates']}\n")
            f.write(f"- **Provenance**: {info['provenance']}\n")
            f.write(f"- **Documented Scientific Limitation**: {info['limitations']}\n\n")
            f.write("### Missing Values by Column\n\n")
            f.write("| Column | Missing Count |\n")
            f.write("| :--- | :--- |\n")
            for col, count in info["missing_values"].items():
                f.write(f"| `{col}` | {count} |\n")
            f.write("\n---\n\n")

    logger.info("Wrote data quality markdown to %s", quality_md_path)


if __name__ == "__main__":
    generate_data_quality_reports()
