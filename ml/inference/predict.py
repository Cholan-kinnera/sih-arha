"""Inference Engine & Prediction Interface for LEWS ML Susceptibility Subsystem."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import joblib
import numpy as np
import pandas as pd

from ml.config import (
    ARTIFACTS_DIR,
    MODEL_VERSION,
    RISK_SEVERITY_THRESHOLDS,
    SCIENTIFIC_DISCLAIMER,
)

logger = logging.getLogger(__name__)


def map_probability_to_severity(probability: float) -> str:
    """Map continuous probability score [0.0 - 1.0] onto standard project severity tiers."""
    clamped = max(0.0, min(1.0, float(probability)))
    if clamped >= RISK_SEVERITY_THRESHOLDS["CRITICAL"]:
        return "CRITICAL"
    if clamped >= RISK_SEVERITY_THRESHOLDS["HIGH"]:
        return "HIGH"
    if clamped >= RISK_SEVERITY_THRESHOLDS["MODERATE"]:
        return "MODERATE"
    return "LOW"


class SusceptibilityPredictor:
    """Production-ready inference wrapper for the trained LEWS Susceptibility model."""

    def __init__(self, artifacts_dir: Optional[Path] = None):
        self.artifacts_dir = artifacts_dir or ARTIFACTS_DIR
        self.model_path = self.artifacts_dir / "baseline_susceptibility_model.joblib"
        self.metadata_path = self.artifacts_dir / "model_metadata.json"
        self.schema_path = self.artifacts_dir / "feature_schema.json"

        self._load_artifacts()

    def _load_artifacts(self) -> None:
        """Load joblib pipeline, metadata, and schema definitions."""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model artifact not found at {self.model_path}. "
                "Please run `python -m ml.training.train_baseline` first."
            )

        self.pipeline = joblib.load(self.model_path)

        with open(self.metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        with open(self.schema_path, "r", encoding="utf-8") as f:
            self.schema = json.load(f)

        self.required_features: List[str] = self.schema["feature_names"]
        self.model_version: str = self.metadata.get("model_version", MODEL_VERSION)

    def predict_susceptibility(
        self,
        features: Union[Dict[str, Any], pd.DataFrame, List[Dict[str, Any]]],
    ) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
        """Predict historical landslide susceptibility probability and severity tier."""
        is_single = isinstance(features, dict)
        if is_single:
            df = pd.DataFrame([features])
        elif isinstance(features, list):
            df = pd.DataFrame(features)
        elif isinstance(features, pd.DataFrame):
            df = features.copy()
        else:
            raise TypeError("Features must be a dictionary, list of dictionaries, or pandas DataFrame.")

        # Strict Feature Validation
        missing_features = [f for f in self.required_features if f not in df.columns]
        if missing_features:
            raise ValueError(
                f"Missing required features for inference: {missing_features}. "
                f"Required schema features ({len(self.required_features)}): {self.required_features}"
            )

        # Reorder to match trained feature order
        X = df[self.required_features].copy()

        # Check numeric types
        for col in self.required_features:
            if not np.issubdtype(X[col].dtype, np.number):
                try:
                    X[col] = pd.to_numeric(X[col])
                except Exception as e:
                    raise TypeError(f"Feature '{col}' could not be converted to numeric: {e}")

        # Compute probabilities
        probabilities = self.pipeline.predict_proba(X)[:, 1]

        results = []
        for prob in probabilities:
            prob_val = round(float(prob), 4)
            pred_class = 1 if prob_val >= 0.5 else 0
            severity = map_probability_to_severity(prob_val)

            results.append({
                "model_version": self.model_version,
                "susceptibility_probability": prob_val,
                "susceptibility_class": pred_class,
                "severity_level": severity,
                "feature_schema_version": self.schema.get("feature_schema_version", "v1.0.0"),
                "provenance": "HISTORICAL_SUSCEPTIBILITY_ML",
                "scientific_disclaimer": SCIENTIFIC_DISCLAIMER,
            })

        return results[0] if is_single else results
