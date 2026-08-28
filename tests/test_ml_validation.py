"""Unit Tests for ML Spatial Validation and Dataset Partitioning."""

import pytest
import pandas as pd
from ml.validation import partition_ner_and_benchmark, get_spatial_cross_validator
from ml.config import DEFAULT_DATASET_PATH


@pytest.fixture
def baseline_df():
    return pd.read_parquet(DEFAULT_DATASET_PATH)


def test_partition_ner_and_benchmark(baseline_df):
    ner_df, non_ner_df = partition_ner_and_benchmark(baseline_df)

    assert len(ner_df) == 87
    assert len(non_ner_df) == 554
    assert len(ner_df) + len(non_ner_df) == len(baseline_df)
    assert (ner_df["is_ner"] == True).all()
    assert (non_ner_df["is_ner"] == False).all()


def test_spatial_group_kfold_zero_leakage(baseline_df):
    ner_df, _ = partition_ner_and_benchmark(baseline_df)
    groups = ner_df["state"]
    y = ner_df["historical_landslide_presence"]

    cv, cv_info = get_spatial_cross_validator(groups, n_splits=4)
    assert cv_info["n_splits"] == 4

    for fold_idx, (train_idx, val_idx) in enumerate(cv.split(ner_df, y, groups=groups)):
        train_states = set(groups.iloc[train_idx].unique())
        val_states = set(groups.iloc[val_idx].unique())

        # Strict Spatial Boundary Check: Zero state overlap between train and val
        overlap = train_states.intersection(val_states)
        assert len(overlap) == 0, f"Spatial state leakage detected in fold {fold_idx + 1}: {overlap}"
        assert len(val_states) > 0
        assert len(train_states) > 0
