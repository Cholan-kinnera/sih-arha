"""Configuration & Constants for LEWS ML Susceptibility Subsystem."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

# Repository Root
REPO_ROOT = Path(__file__).resolve().parent.parent

# Model Metadata & Versioning
MODEL_NAME = "LEWS District Historical Landslide Susceptibility Baseline"
MODEL_VERSION = "lews-susceptibility-baseline-v1.0.0"
FEATURE_SCHEMA_VERSION = "v1.0.0"
RANDOM_STATE = 42

# Default Data Paths
DEFAULT_DATASET_PATH = REPO_ROOT / "data" / "processed" / "lews_baseline_dataset.parquet"
ARTIFACTS_DIR = REPO_ROOT / "ml" / "artifacts"
REPORTS_DIR = REPO_ROOT / "ml" / "reports"

# Target Specification
PRIMARY_TARGET = "historical_landslide_presence"
SECONDARY_TARGET = "historical_landslide_count"

# Strict Target & Leakage Quarantine Columns (Must NEVER appear in feature matrix X)
TARGET_COLUMNS = [
    "historical_landslide_presence",
    "historical_landslide_count",
]

LEAKAGE_COLUMNS = [
    "historical_landslide_presence",
    "historical_landslide_count",
    "landslide_count",
    "landslide_presence",
    "incident_count",
    "target",
    "label",
]

# Geographic Metadata Columns (Used for splitting, grouping, and display; not direct numeric features)
METADATA_COLUMNS = [
    "state",
    "district",
    "subdivision",
    "state_raw",
    "district_raw",
    "is_ner",
]

# Canonical Candidate Features Verified in lews_baseline_dataset.parquet
CANONICAL_FEATURE_COLUMNS: List[str] = [
    # 1. Climatological Rainfall Normals (mm)
    "annual_rainfall_normal_mm",
    "monsoon_rainfall_normal_mm",
    "pre_monsoon_rainfall_normal_mm",
    "winter_rainfall_normal_mm",
    "post_monsoon_rainfall_normal_mm",
    # 2. Seasonality & Concentration Indices
    "monsoon_concentration_ratio",
    "pre_monsoon_concentration_ratio",
    "rainfall_seasonality_index",
    "peak_rainfall_month",
    "peak_month_rainfall_mm",
    "rainfall_variability_cv",
    # 3. Monthly Climatological Normals (mm)
    "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
    "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
    # 4. Subdivision 115-Year Historical Statistics (1901-2015)
    "subdivision_historical_mean_annual_mm",
    "subdivision_historical_std_annual_mm",
    "subdivision_monsoon_mean_mm",
    "subdivision_monsoon_std_mm",
    "subdivision_annual_min_mm",
    "subdivision_annual_max_mm",
]

# Standard Project Risk Severity Thresholds (Historical Susceptibility Tiers)
RISK_SEVERITY_THRESHOLDS = {
    "LOW": 0.00,
    "MODERATE": 0.30,
    "HIGH": 0.60,
    "CRITICAL": 0.80,
}

# Scientific Limitations Disclaimer
SCIENTIFIC_DISCLAIMER = (
    "DISCLAIMER: This model estimates district-level historical landslide susceptibility based "
    "on long-term climatological rainfall normals and historical patterns. It is NOT a real-time "
    "or event-trigger prediction system and does not predict specific landslide occurrences on given dates."
)
