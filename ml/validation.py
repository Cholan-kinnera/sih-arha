"""Spatial Group-Aware Validation Strategy for LEWS ML."""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple
import pandas as pd
from sklearn.model_selection import GroupKFold

logger = logging.getLogger(__name__)


def partition_ner_and_benchmark(
    df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Explicitly separate NER primary dataset from non-NER benchmark dataset."""
    if "is_ner" not in df.columns:
        raise ValueError("Column 'is_ner' required to partition NER from benchmark data.")

    ner_df = df[df["is_ner"] == True].copy().reset_index(drop=True)
    non_ner_df = df[df["is_ner"] == False].copy().reset_index(drop=True)

    logger.info(
        "Partitioned datasets: %d NER target records, %d Non-NER benchmark records.",
        len(ner_df),
        len(non_ner_df),
    )
    return ner_df, non_ner_df


def get_spatial_cross_validator(
    groups: pd.Series,
    n_splits: int = 4,
) -> Tuple[GroupKFold, Dict[str, Any]]:
    """Configure a GroupKFold spatial cross-validator on state groupings."""
    unique_groups = groups.nunique()

    # Defensive fold count adjustment
    actual_splits = min(n_splits, unique_groups)
    if actual_splits < n_splits:
        logger.warning(
            "Requested %d folds, but only %d unique spatial groups found. Adjusted to %d splits.",
            n_splits,
            unique_groups,
            actual_splits,
        )

    cv = GroupKFold(n_splits=actual_splits)

    info = {
        "strategy": "GroupKFold",
        "group_variable": "state",
        "n_splits": actual_splits,
        "unique_groups_count": unique_groups,
        "unique_groups": sorted(list(groups.unique())),
        "description": "Spatial GroupKFold ensures districts from the same state never leak between train and validation.",
    }
    return cv, info
