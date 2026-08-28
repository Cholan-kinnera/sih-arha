"""Unit Tests for Inference Interface and Severity Mapping."""

import pytest
import pandas as pd
from ml.inference.predict import SusceptibilityPredictor, map_probability_to_severity
from ml.config import DEFAULT_DATASET_PATH, ARTIFACTS_DIR


def test_severity_mapping_bands():
    assert map_probability_to_severity(0.15) == "LOW"
    assert map_probability_to_severity(0.29) == "LOW"
    assert map_probability_to_severity(0.30) == "MODERATE"
    assert map_probability_to_severity(0.59) == "MODERATE"
    assert map_probability_to_severity(0.60) == "HIGH"
    assert map_probability_to_severity(0.79) == "HIGH"
    assert map_probability_to_severity(0.80) == "CRITICAL"
    assert map_probability_to_severity(0.95) == "CRITICAL"


def test_susceptibility_predictor_single_and_batch():
    predictor = SusceptibilityPredictor(artifacts_dir=ARTIFACTS_DIR)

    # Load a sample row from baseline dataset
    df = pd.read_parquet(DEFAULT_DATASET_PATH)
    sample_dict = df.iloc[0].to_dict()

    # 1. Single sample prediction
    res_single = predictor.predict_susceptibility(sample_dict)
    assert "susceptibility_probability" in res_single
    assert 0.0 <= res_single["susceptibility_probability"] <= 1.0
    assert res_single["severity_level"] in {"LOW", "MODERATE", "HIGH", "CRITICAL"}
    assert "scientific_disclaimer" in res_single

    # 2. Batch prediction
    sample_batch = df.head(5)
    res_batch = predictor.predict_susceptibility(sample_batch)
    assert len(res_batch) == 5
    for item in res_batch:
        assert 0.0 <= item["susceptibility_probability"] <= 1.0


def test_susceptibility_predictor_rejects_missing_features():
    predictor = SusceptibilityPredictor(artifacts_dir=ARTIFACTS_DIR)

    incomplete_dict = {"annual_rainfall_normal_mm": 2500.0}
    with pytest.raises(ValueError, match="Missing required features for inference"):
        predictor.predict_susceptibility(incomplete_dict)
