"""LEWS Machine Learning Subsystem Package."""

from ml.config import (
    CANONICAL_FEATURE_COLUMNS,
    MODEL_NAME,
    MODEL_VERSION,
    PRIMARY_TARGET,
    RISK_SEVERITY_THRESHOLDS,
    SCIENTIFIC_DISCLAIMER,
)
from ml.features import create_preprocessor, extract_feature_matrix, validate_feature_schema
from ml.inference.predict import SusceptibilityPredictor, map_probability_to_severity
from ml.validation import get_spatial_cross_validator, partition_ner_and_benchmark

__all__ = [
    "CANONICAL_FEATURE_COLUMNS",
    "MODEL_NAME",
    "MODEL_VERSION",
    "PRIMARY_TARGET",
    "RISK_SEVERITY_THRESHOLDS",
    "SCIENTIFIC_DISCLAIMER",
    "create_preprocessor",
    "extract_feature_matrix",
    "validate_feature_schema",
    "SusceptibilityPredictor",
    "map_probability_to_severity",
    "get_spatial_cross_validator",
    "partition_ner_and_benchmark",
]
