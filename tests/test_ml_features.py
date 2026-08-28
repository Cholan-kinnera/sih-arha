"""Unit Tests for Feature Schema Validation and Leakage Prevention."""

import pytest
import pandas as pd
from ml.features import validate_feature_schema, create_preprocessor, extract_feature_matrix
from ml.config import DEFAULT_DATASET_PATH, CANONICAL_FEATURE_COLUMNS


@pytest.fixture
def baseline_df():
    return pd.read_parquet(DEFAULT_DATASET_PATH)


def test_validate_feature_schema_rejects_leakage_columns(baseline_df):
    # Attempting to include target columns in features MUST raise ValueError
    leaking_features = CANONICAL_FEATURE_COLUMNS + ["historical_landslide_presence"]
    with pytest.raises(ValueError, match="TARGET LEAKAGE DETECTED"):
        validate_feature_schema(baseline_df, expected_features=leaking_features)

    leaking_features_count = ["historical_landslide_count"]
    with pytest.raises(ValueError, match="TARGET LEAKAGE DETECTED"):
        validate_feature_schema(baseline_df, expected_features=leaking_features_count)


def test_validate_feature_schema_validates_canonical_features(baseline_df):
    valid_features = validate_feature_schema(baseline_df)
    assert len(valid_features) > 0
    assert "historical_landslide_presence" not in valid_features
    assert "historical_landslide_count" not in valid_features


def test_extract_feature_matrix(baseline_df):
    ner_df = baseline_df[baseline_df["is_ner"]].copy()
    X, y, groups = extract_feature_matrix(ner_df)

    assert len(X) == len(ner_df)
    assert len(y) == len(ner_df)
    assert len(groups) == len(ner_df)
    assert set(y.unique()).issubset({0, 1})
    assert "historical_landslide_presence" not in X.columns
    assert "state" not in X.columns
