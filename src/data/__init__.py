"""LEWS Data Engineering & Dataset Foundation Package."""

from src.data.geography import GeographyNormalizer
from src.data.loaders import (
    discover_all_datasets,
    find_data_file,
    get_project_root,
    load_raw_landslides,
    load_raw_rainfall_district,
    load_raw_rainfall_subdivision,
)
from src.data.cleaning import (
    clean_landslides,
    clean_rainfall_district,
    clean_rainfall_subdivision,
)
from src.data.feature_engineering import (
    calculate_seasonality_index,
    extract_district_rainfall_features,
    extract_subdivision_historical_features,
)
from src.data.pipeline import build_baseline_dataset
from src.data.experimental_sensors import process_experimental_sensors

__all__ = [
    "GeographyNormalizer",
    "discover_all_datasets",
    "find_data_file",
    "get_project_root",
    "load_raw_landslides",
    "load_raw_rainfall_district",
    "load_raw_rainfall_subdivision",
    "clean_landslides",
    "clean_rainfall_district",
    "clean_rainfall_subdivision",
    "calculate_seasonality_index",
    "extract_district_rainfall_features",
    "extract_subdivision_historical_features",
    "build_baseline_dataset",
    "process_experimental_sensors",
]
