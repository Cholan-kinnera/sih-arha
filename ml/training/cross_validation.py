"""Spatial Cross-Validation Engine for LEWS ML."""

from __future__ import annotations

import logging
from typing import Any, Callable, Dict, List, Tuple
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline

from ml.training.evaluate import calculate_classification_metrics
from ml.validation import get_spatial_cross_validator

logger = logging.getLogger(__name__)


def run_spatial_cross_validation(
    pipeline_factory: Callable[[], Pipeline],
    X: pd.DataFrame,
    y: pd.Series,
    groups: pd.Series,
    n_splits: int = 4,
    model_name: str = "Baseline Model",
) -> Dict[str, Any]:
    """Execute spatial group cross-validation with out-of-fold probability collection."""
    cv, cv_info = get_spatial_cross_validator(groups, n_splits=n_splits)

    fold_metrics_list: List[Dict[str, Any]] = []
    oof_probabilities = np.zeros(len(X), dtype=float)

    for fold_idx, (train_idx, val_idx) in enumerate(cv.split(X, y, groups=groups)):
        X_train, y_train = X.iloc[train_idx], y.iloc[train_idx]
        X_val, y_val = X.iloc[val_idx], y.iloc[val_idx]
        val_states = list(groups.iloc[val_idx].unique())

        # Fit fresh pipeline strictly on training fold
        pipeline = pipeline_factory()
        pipeline.fit(X_train, y_train)

        # Predict out-of-fold probabilities
        y_val_prob = pipeline.predict_proba(X_val)[:, 1]
        oof_probabilities[val_idx] = y_val_prob

        # Fold evaluation
        fold_metrics = calculate_classification_metrics(y_val.values, y_val_prob)
        fold_metrics["fold"] = fold_idx + 1
        fold_metrics["validation_states"] = val_states
        fold_metrics["train_samples"] = len(train_idx)
        fold_metrics["val_samples"] = len(val_idx)
        fold_metrics["val_positives"] = int(y_val.sum())
        fold_metrics_list.append(fold_metrics)

        logger.debug(
            "[%s] Fold %d (States: %s): PR-AUC=%.4f, ROC-AUC=%.4f, Recall=%.4f",
            model_name,
            fold_idx + 1,
            val_states,
            fold_metrics["pr_auc"],
            fold_metrics["roc_auc"],
            fold_metrics["recall"],
        )

    # Compute overall Out-Of-Fold metrics
    overall_oof_metrics = calculate_classification_metrics(y.values, oof_probabilities)

    # Compute mean and standard deviation across folds
    metric_keys = ["pr_auc", "roc_auc", "precision", "recall", "f1", "balanced_accuracy", "brier_score"]
    mean_metrics: Dict[str, float] = {}
    std_metrics: Dict[str, float] = {}

    for k in metric_keys:
        vals = [f[k] for f in fold_metrics_list]
        mean_metrics[k] = round(float(np.mean(vals)), 4)
        std_metrics[k] = round(float(np.std(vals)), 4)

    return {
        "model_name": model_name,
        "mean_metrics": mean_metrics,
        "std_metrics": std_metrics,
        "oof_metrics": overall_oof_metrics,
        "fold_metrics": fold_metrics_list,
        "oof_probabilities": oof_probabilities,
        "cv_info": cv_info,
    }
