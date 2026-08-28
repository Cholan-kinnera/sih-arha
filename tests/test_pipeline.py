"""Integration Tests for End-to-End Baseline Dataset Pipeline."""

import pytest
import pandas as pd
from src.data.pipeline import build_baseline_dataset
from src.data.loaders import get_project_root


def test_build_baseline_dataset_execution():
    df, metrics = build_baseline_dataset()

    assert len(df) == 641
    assert metrics["ner_districts"] == 87
    assert metrics["positive_landslide_districts_total"] > 0
    assert metrics["positive_landslide_districts_ner"] > 0

    # Test primary key uniqueness (no duplicate state, district pairs)
    assert df.duplicated(subset=["state", "district"]).sum() == 0


def test_target_label_consistency():
    df, _ = build_baseline_dataset()

    # Target consistency: historical_landslide_presence == 1 iff historical_landslide_count >= 1
    presence_calc = (df["historical_landslide_count"] >= 1).astype(int)
    assert (df["historical_landslide_presence"] == presence_calc).all()

    # Presence must be strictly binary {0, 1}
    assert set(df["historical_landslide_presence"].unique()).issubset({0, 1})
    assert (df["historical_landslide_count"] >= 0).all()


def test_feature_engineering_sanity():
    df, _ = build_baseline_dataset()

    # Seasonality index non-negativity
    assert (df["rainfall_seasonality_index"] >= 0.0).all()

    # Monsoon concentration ratio between 0.0 and 1.0 (with slight tolerance for edge cases)
    assert (df["monsoon_concentration_ratio"] >= 0.0).all()
    assert (df["monsoon_concentration_ratio"] <= 1.05).all()

    # Peak rainfall month between 1 and 12
    assert (df["peak_rainfall_month"] >= 1).all() and (df["peak_rainfall_month"] <= 12).all()


def test_dataset_determinism(tmp_path):
    df1, _ = build_baseline_dataset(output_dir=tmp_path)
    df2, _ = build_baseline_dataset(output_dir=tmp_path)

    # Values must be 100% identical between runs
    pd.testing.assert_frame_equal(df1, df2)


def test_output_artifacts_exist():
    root = get_project_root()
    assert (root / "data" / "processed" / "landslide_clean.csv").exists()
    assert (root / "data" / "processed" / "rainfall_district_clean.csv").exists()
    assert (root / "data" / "processed" / "rainfall_subdivision_clean.csv").exists()
    assert (root / "data" / "processed" / "lews_baseline_dataset.csv").exists()
    assert (root / "data" / "processed" / "lews_baseline_dataset.parquet").exists()
    assert (root / "data" / "reports" / "baseline_dataset_report.md").exists()
