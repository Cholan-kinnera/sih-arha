"""Dynamic Rainfall Accumulation & Intensity Engine for LEWS."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List, Optional, Union
import numpy as np
import pandas as pd

from src.risk.config import RAINFALL_THRESHOLDS, STALENESS_THRESHOLDS_HOURS
from src.risk.types import DataFreshnessStatus, RainfallAccumulation, TelemetryProvenance, TelemetryReading

logger = logging.getLogger(__name__)


def compute_rainfall_factor(accumulation: RainfallAccumulation) -> float:
    """Compute normalized dynamic rainfall factor [0.0 - 1.0].

    Combines short-term 24h burst intensity and 72h antecedent saturation:
        factor_24h = min(1.0, rainfall_24h / critical_24h_threshold)
        factor_72h = min(1.0, rainfall_72h / saturation_72h_threshold)
        rainfall_factor = 0.65 * factor_24h + 0.35 * factor_72h
    """
    crit_24 = RAINFALL_THRESHOLDS["critical_24h_mm"]
    sat_72 = RAINFALL_THRESHOLDS["saturation_72h_mm"]

    f_24 = min(1.0, max(0.0, accumulation.rainfall_24h_mm / crit_24))
    f_72 = min(1.0, max(0.0, accumulation.rainfall_72h_mm / sat_72))

    score = 0.65 * f_24 + 0.35 * f_72
    return round(float(np.clip(score, 0.0, 1.0)), 4)


class RainfallAccumulator:
    """Computes multi-window rolling rainfall accumulations from telemetry streams."""

    @staticmethod
    def calculate_from_readings(
        readings: List[TelemetryReading],
        as_of_time: Optional[datetime] = None,
    ) -> RainfallAccumulation:
        """Calculate multi-duration accumulations from a series of telemetry readings."""
        if not readings:
            return RainfallAccumulation(
                rainfall_1h_mm=0.0,
                rainfall_6h_mm=0.0,
                rainfall_24h_mm=0.0,
                rainfall_48h_mm=0.0,
                rainfall_72h_mm=0.0,
                provenance=TelemetryProvenance.CLIMATOLOGICAL,
                freshness=DataFreshnessStatus.MISSING,
            )

        now = as_of_time or datetime.now(timezone.utc)
        sorted_readings = sorted(readings, key=lambda r: r.timestamp_utc)
        latest_reading = sorted_readings[-1]

        # Calculate time delta for freshness
        age_hours = (now - latest_reading.timestamp_utc).total_seconds() / 3600.0
        is_simulated = any(r.provenance == TelemetryProvenance.SIMULATED for r in readings)

        if is_simulated:
            freshness = DataFreshnessStatus.SIMULATED
            provenance = TelemetryProvenance.SIMULATED
        elif age_hours > STALENESS_THRESHOLDS_HOURS["rainfall"]:
            freshness = DataFreshnessStatus.STALE
            provenance = latest_reading.provenance
        else:
            freshness = DataFreshnessStatus.AVAILABLE
            provenance = latest_reading.provenance

        # Accumulation calculations
        acc_1h = sum(r.rainfall_rate_mm_h for r in readings if (now - r.timestamp_utc).total_seconds() <= 3600)
        acc_6h = sum(r.rainfall_rate_mm_h for r in readings if (now - r.timestamp_utc).total_seconds() <= 6 * 3600)
        acc_24h = sum(r.rainfall_rate_mm_h for r in readings if (now - r.timestamp_utc).total_seconds() <= 24 * 3600)
        acc_48h = sum(r.rainfall_rate_mm_h for r in readings if (now - r.timestamp_utc).total_seconds() <= 48 * 3600)
        acc_72h = sum(r.rainfall_rate_mm_h for r in readings if (now - r.timestamp_utc).total_seconds() <= 72 * 3600)

        return RainfallAccumulation(
            rainfall_1h_mm=round(float(acc_1h), 2),
            rainfall_6h_mm=round(float(acc_6h), 2),
            rainfall_24h_mm=round(float(acc_24h), 2),
            rainfall_48h_mm=round(float(acc_48h), 2),
            rainfall_72h_mm=round(float(acc_72h), 2),
            provenance=provenance,
            freshness=freshness,
        )
