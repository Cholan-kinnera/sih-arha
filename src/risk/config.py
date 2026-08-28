"""Configuration and Threshold Specifications for LEWS Dynamic Risk Engine."""

from __future__ import annotations

from typing import Dict

# Standard Project Risk Severity Thresholds (Authoritative & Reused Across Project)
RISK_SEVERITY_THRESHOLDS: Dict[str, float] = {
    "LOW": 0.00,
    "MODERATE": 0.30,
    "HIGH": 0.60,
    "CRITICAL": 0.80,
}

# ==============================================================================
# INITIAL MVP OPERATIONAL WEIGHTS
# ==============================================================================
# NOTE: These weights represent baseline operational defaults for demonstration
# and prototype validation. They are NOT scientifically finalized empirical coefficients.
# Full calibration requires in-situ geotechnical telemetry and field observation.
DEFAULT_RISK_WEIGHTS: Dict[str, float] = {
    "static_susceptibility": 0.35,
    "terrain": 0.25,
    "rainfall": 0.25,
    "soil_moisture": 0.10,
    "historical_context": 0.05,
}

# Physical Scaling & Empirical Trigger Thresholds
RAINFALL_THRESHOLDS = {
    "warning_24h_mm": 75.0,     # IMD Heavy Rainfall baseline
    "critical_24h_mm": 150.0,   # IMD Very Heavy / Extreme baseline
    "saturation_72h_mm": 200.0, # Antecedent moisture saturation threshold
}

TERRAIN_SCALING = {
    "critical_slope_deg": 35.0,  # Slope threshold above which landslide probability increases sharply
    "max_slope_deg": 60.0,       # Saturation upper bound for slope normalization
    "critical_tri": 25.0,        # High roughness index threshold
}

# Timeouts & Staleness Criteria
STALENESS_THRESHOLDS_HOURS = {
    "rainfall": 6.0,       # Telemetry older than 6 hours is marked STALE
    "soil_moisture": 12.0, # Soil moisture older than 12 hours is marked STALE
}

DYNAMIC_RISK_DISCLAIMER = (
    "DISCLAIMER: Dynamic risk scores reflect multi-factor computational estimates derived from "
    "historical susceptibility, terrain gradients, and dynamic telemetry. They are operational decision-support "
    "indicators and do NOT constitute official emergency civil evacuation orders."
)
