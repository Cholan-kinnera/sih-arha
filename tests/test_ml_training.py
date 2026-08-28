"""Unit Tests for ML Model Training and Benchmarking Pipeline."""

import pytest
import pandas as pd
from ml.training.train_baseline import train_and_evaluate_all_models
from ml.config import ARTIFACTS_DIR, REPORTS_DIR


def test_train_and_evaluate_all_models_execution(tmp_path):
    artifacts_out = tmp_path / "artifacts"
    reports_out = tmp_path / "reports"

    results = train_and_evaluate_all_models(
        output_dir=artifacts_out,
        reports_dir=reports_out,
        random_state=42,
    )

    assert "champion_model_name" in results
    assert results["champion_pipeline"] is not None

    # Check artifacts exist
    assert (artifacts_out / "baseline_susceptibility_model.joblib").exists()
    assert (artifacts_out / "model_metadata.json").exists()
    assert (artifacts_out / "feature_schema.json").exists()

    # Check reports exist
    assert (reports_out / "baseline_ml_report.md").exists()
    assert (reports_out / "model_comparison.csv").exists()
    assert (reports_out / "feature_importance.csv").exists()
    assert (reports_out / "threshold_analysis.csv").exists()
    assert (reports_out / "validation_results.json").exists()


def test_training_determinism(tmp_path):
    dir1 = tmp_path / "run1"
    dir2 = tmp_path / "run2"

    res1 = train_and_evaluate_all_models(output_dir=dir1 / "art", reports_dir=dir1 / "rep", random_state=42)
    res2 = train_and_evaluate_all_models(output_dir=dir2 / "art", reports_dir=dir2 / "rep", random_state=42)

    # Verify identical champion model and identical comparison scores
    assert res1["champion_model_name"] == res2["champion_model_name"]
    pd.testing.assert_frame_equal(res1["comparison"], res2["comparison"])
