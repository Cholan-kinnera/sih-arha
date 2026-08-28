"""Feature Validation and Preprocessing Pipeline Builder for LEWS ML."""

from __future__ import annotations

import logging
from typing import List, Optional, Tuple
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from ml.config import (
    CANONICAL_FEATURE_COLUMNS,
    LEAKAGE_COLUMNS,
    METADATA_COLUMNS,
    PRIMARY_TARGET,
    TARGET_COLUMNS,
)

logger = logging.getLogger(__name__)


def validate_feature_schema(
    df: pd.DataFrame,
    expected_features: Optional[List[str]] = None,
    allow_missing: bool = False,
) -> List[str]:
    """Validate that input dataframe conforms to ML feature schema and contains no leakage columns."""
    candidates = expected_features or CANONICAL_FEATURE_COLUMNS

    # 1. Strict Target & Leakage Quarantine Guard
    for col in candidates:
        if col in LEAKAGE_COLUMNS or col in TARGET_COLUMNS:
            raise ValueError(
                f"TARGET LEAKAGE DETECTED: Column '{col}' is quarantined as target/leakage and "
                "must never be included in the ML predictor feature set."
            )

    # 2. Check column availability in dataset
    available_cols = [c for c in candidates if c in df.columns]
    missing_cols = [c for c in candidates if c not in df.columns]

    if missing_cols and not allow_missing:
        raise ValueError(
            f"Missing required feature columns in dataset: {missing_cols}. "
            f"Available in schema: {available_cols}"
        )

    if not available_cols:
        raise ValueError("No valid candidate feature columns found in dataset.")

    # 3. Check for infinite / unparseable values
    for col in available_cols:
        if not np.issubdtype(df[col].dtype, np.number):
            raise TypeError(
                f"Feature column '{col}' has non-numeric dtype '{df[col].dtype}'. "
                "All ML predictor features must be numeric."
            )
        if np.isinf(df[col].values).any():
            raise ValueError(f"Feature column '{col}' contains infinite values.")

    return available_cols


def create_preprocessor(
    feature_names: List[str],
    scale_numeric: bool = True,
) -> ColumnTransformer:
    """Create a scikit-learn ColumnTransformer preprocessor for numeric features.

    Imputes missing values using median (computed on training fold) and scales features.
    """
    transformers = []

    if scale_numeric:
        numeric_pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ])
    else:
        numeric_pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
        ])

    transformers.append(("num", numeric_pipeline, feature_names))

    preprocessor = ColumnTransformer(
        transformers=transformers,
        remainder="drop",
        verbose_feature_names_out=False,
    )
    return preprocessor


def extract_feature_matrix(
    df: pd.DataFrame,
    feature_cols: Optional[List[str]] = None,
) -> Tuple[pd.DataFrame, pd.Series, pd.Series]:
    """Extract validated predictor matrix X, target series y, and grouping variable (state)."""
    verified_features = validate_feature_schema(df, feature_cols)

    if PRIMARY_TARGET not in df.columns:
        raise ValueError(f"Target column '{PRIMARY_TARGET}' not found in dataframe.")

    X = df[verified_features].copy()
    y = df[PRIMARY_TARGET].astype(int).copy()
    groups = df["state"].copy() if "state" in df.columns else pd.Series(["UNKNOWN"] * len(df))

    return X, y, groups
