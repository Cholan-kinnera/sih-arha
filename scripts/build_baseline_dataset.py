#!/usr/bin/env python3
"""Single-Command Baseline Dataset Builder & Lineage Reporter for LEWS.

Executes end-to-end cleaning, feature engineering, and dataset assembly:
- data/processed/landslide_clean.csv
- data/processed/rainfall_district_clean.csv
- data/processed/rainfall_subdivision_clean.csv
- data/processed/lews_baseline_dataset.csv
- data/processed/lews_baseline_dataset.parquet
- data/reports/baseline_dataset_report.md
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

# Ensure repository root is in pythonpath
_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

import pandas as pd

from src.data.loaders import get_project_root
from src.data.pipeline import build_baseline_dataset
from src.data.experimental_sensors import process_experimental_sensors

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def main() -> None:
    """Run full reproducible pipeline and generate baseline lineage report."""
    root = get_project_root()
    reports_dir = root / "data" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Starting LEWS Baseline Dataset Build...")

    # 1. Build main baseline dataset
    baseline_df, metrics = build_baseline_dataset()

    # 2. Process optional experimental sensor datasets
    exp_df = process_experimental_sensors()

    # 3. Generate baseline dataset lineage report
    report_path = reports_dir / "baseline_dataset_report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# LEWS — Baseline ML Dataset & Lineage Report\n\n")
        f.write("Generated automatically by `scripts/build_baseline_dataset.py`.\n\n")
        f.write("## 1. Executive Summary & Dimensions\n\n")
        f.write(f"- **Total Districts in Baseline**: {metrics['total_districts']}\n")
        f.write(f"- **North-Eastern Region (NER) Districts**: {metrics['ner_districts']}\n")
        f.write(f"- **Non-NER Control Districts**: {metrics['non_ner_districts']}\n")
        f.write(f"- **Districts with Historical Landslides (Presence=1)**: {metrics['positive_landslide_districts_total']} ({metrics['positive_landslide_districts_ner']} in NER)\n")
        f.write(f"- **Total Landslide Events Mapped**: {metrics['total_landslide_incidents_mapped']}\n")
        f.write(f"- **Total Engineered Features**: {metrics['total_columns']}\n\n")

        f.write("## 2. Feature Definitions & Formulas\n\n")
        f.write("| Column Name | Type | Physical Meaning / Formula | Provenance |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        f.write("| `state` | String | Canonical Indian State / UT name | IMD / Census |\n")
        f.write("| `district` | String | Canonical District name | IMD / Census |\n")
        f.write("| `subdivision` | String | IMD Meteorological Subdivision | IMD |\n")
        f.write("| `is_ner` | Boolean | True for 8 North-Eastern States (Assam, AP, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura) | Geographic Standard |\n")
        f.write("| `annual_rainfall_normal_mm` | Float | Long-term annual normal precipitation (mm) | IMD Climatology |\n")
        f.write("| `monsoon_rainfall_normal_mm` | Float | June–September SW Monsoon normal precipitation (mm) | IMD Climatology |\n")
        f.write("| `pre_monsoon_rainfall_normal_mm` | Float | March–May Pre-Monsoon normal precipitation (mm) | IMD Climatology |\n")
        f.write("| `winter_rainfall_normal_mm` | Float | January–February Winter normal precipitation (mm) | IMD Climatology |\n")
        f.write("| `post_monsoon_rainfall_normal_mm` | Float | October–December Post-Monsoon normal precipitation (mm) | IMD Climatology |\n")
        f.write("| `monsoon_concentration_ratio` | Float | Proportion of annual rainfall during monsoon (Jun-Sep / Annual) | Engineered Ratio |\n")
        f.write("| `rainfall_seasonality_index` | Float | Walsh & Lawler (1981) Seasonality Index $\\frac{1}{R}\\sum |r_m - \\frac{R}{12}|$ | Engineered Index |\n")
        f.write("| `peak_rainfall_month` | Integer | Month (1-12) with highest normal precipitation | Engineered Metric |\n")
        f.write("| `peak_month_rainfall_mm` | Float | Normal precipitation volume in peak month (mm) | IMD Climatology |\n")
        f.write("| `rainfall_variability_cv` | Float | Coefficient of variation across 12 monthly normals | Engineered Statistic |\n")
        f.write("| `subdivision_historical_mean_annual_mm` | Float | 115-year historical mean annual precipitation per subdivision (1901-2015) | IMD Time-Series |\n")
        f.write("| `subdivision_historical_std_annual_mm` | Float | 115-year standard deviation of annual precipitation per subdivision | IMD Time-Series |\n")
        f.write("| `subdivision_monsoon_mean_mm` | Float | 115-year historical mean monsoon precipitation per subdivision | IMD Time-Series |\n")
        f.write("| `historical_landslide_count` | Integer | **Ground-Truth Target**: Recorded historical landslide incidences in district | GSI Reports (2016-2020) |\n")
        f.write("| `historical_landslide_presence` | Binary (0/1) | **Ground-Truth Target**: 1 if `historical_landslide_count >= 1`, else 0 | Derived Binary Target |\n\n")

        f.write("## 3. Ground-Truth Target Label Methodology\n\n")
        f.write("- **Definition**: `historical_landslide_count` and `historical_landslide_presence` reflect verified historical landslide occurrences cataloged by the Geological Survey of India (2016–2020).\n")
        f.write("- **Scientific Caution**: This is a **spatial susceptibility and climatological exposure label**. It does NOT represent sub-daily event-trigger prediction, as sub-daily dynamic rainfall is not present in the historical normals dataset.\n\n")

        f.write("## 4. Leakage Prevention & Reproducibility\n\n")
        f.write("- **No Future Information**: Aggregations are strictly based on historical climatology (1901–2015) and static spatial definitions.\n")
        f.write("- **Deterministic Execution**: Output is 100% reproducible with zero stochastic or unseeded operations.\n\n")

    logger.info("Successfully completed LEWS Baseline Dataset Build. Lineage report written to %s", report_path)


if __name__ == "__main__":
    main()
