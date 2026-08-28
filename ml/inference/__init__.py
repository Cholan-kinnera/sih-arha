"""Inference package for LEWS ML."""

from ml.inference.predict import SusceptibilityPredictor, map_probability_to_severity

__all__ = ["SusceptibilityPredictor", "map_probability_to_severity"]
