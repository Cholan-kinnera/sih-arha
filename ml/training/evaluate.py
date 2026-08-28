"""Evaluation Metrics, Threshold Analysis, and Model Explainability Module for LEWS ML."""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional
import numpy as np
import pandas as pd
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    average_precision_score,
    balanced_accuracy_score,
    brier_score_loss,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

logger = logging.getLogger(__name__)


def calculate_classification_metrics(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    threshold: float = 0.5,
) -> Dict[str, Any]:
    """Calculate comprehensive evaluation metrics for binary classification."""
    y_true = np.asarray(y_true).astype(int)
    y_prob = np.asarray(y_prob).astype(float)
    y_pred = (y_prob >= threshold).astype(int)

    # Check for single-class edge cases in validation folds
    has_pos = (y_true == 1).any()
    has_neg = (y_true == 0).any()

    if has_pos and has_neg:
        roc_auc = float(roc_auc_score(y_true, y_prob))
        pr_auc = float(average_precision_score(y_true, y_prob))
    else:
        roc_auc = 0.5
        pr_auc = float(y_true.mean())

    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    bal_acc = float(balanced_accuracy_score(y_true, y_pred))
    brier = float(brier_score_loss(y_true, y_prob))

    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()

    return {
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(pr_auc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4),
        "balanced_accuracy": round(bal_acc, 4),
        "brier_score": round(brier, 4),
        "true_positives": int(tp),
        "false_positives": int(fp),
        "true_negatives": int(tn),
        "false_negatives": int(fn),
        "positive_rate": round(float(y_true.mean()), 4),
        "threshold_used": float(threshold),
    }


def evaluate_threshold_sweep(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    thresholds: Optional[List[float]] = None,
) -> pd.DataFrame:
    """Analyze precision, recall, and F1 across a range of classification probability thresholds."""
    cutoffs = thresholds or [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80]
    records = []

    for t in cutoffs:
        metrics = calculate_classification_metrics(y_true, y_prob, threshold=t)
        records.append({
            "threshold": t,
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1": metrics["f1"],
            "balanced_accuracy": metrics["balanced_accuracy"],
            "flagged_districts_count": metrics["true_positives"] + metrics["false_positives"],
            "true_positives": metrics["true_positives"],
            "false_positives": metrics["false_positives"],
            "false_negatives": metrics["false_negatives"],
        })

    return pd.DataFrame(records)


def extract_feature_explanations(
    fitted_pipeline: Any,
    feature_names: List[str],
    X: Optional[pd.DataFrame] = None,
    y: Optional[pd.Series] = None,
) -> pd.DataFrame:
    """Extract feature importance weights, standardized coefficients, or permutation importances."""
    estimator = fitted_pipeline.named_steps["classifier"] if hasattr(fitted_pipeline, "named_steps") else fitted_pipeline

    records = []

    # Case 1: Linear / Logistic Regression (Coefficients)
    if hasattr(estimator, "coef_"):
        coefs = estimator.coef_[0]
        for name, val in zip(feature_names, coefs):
            records.append({
                "feature_name": name,
                "importance_type": "standardized_coefficient",
                "importance_score": round(abs(float(val)), 4),
                "raw_coefficient": round(float(val), 4),
                "influence_direction": "POSITIVE_SUSCEPTIBILITY" if val > 0 else "NEGATIVE_SUSCEPTIBILITY",
            })

    # Case 2: Random Forest (MDI Gini Importances)
    elif hasattr(estimator, "feature_importances_"):
        importances = estimator.feature_importances_
        for name, val in zip(feature_names, importances):
            records.append({
                "feature_name": name,
                "importance_type": "gini_feature_importance",
                "importance_score": round(float(val), 4),
                "raw_coefficient": round(float(val), 4),
                "influence_direction": "NON_LINEAR_CONTRIBUTION",
            })

    # Case 3: Permutation Importance (HistGradientBoosting / GBDT)
    elif X is not None and y is not None:
        perm = permutation_importance(fitted_pipeline, X, y, n_repeats=10, random_state=42)
        for name, val in zip(feature_names, perm.importances_mean):
            records.append({
                "feature_name": name,
                "importance_type": "permutation_importance",
                "importance_score": round(float(val), 4),
                "raw_coefficient": round(float(val), 4),
                "influence_direction": "NON_LINEAR_CONTRIBUTION",
            })

    df = pd.DataFrame(records)
    if not df.empty:
        df = df.sort_values(by="importance_score", ascending=False).reset_index(drop=True)
    return df
