"""Deterministic Telemetry Stream Simulator for LEWS Testing & Demonstrations."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
import numpy as np

from src.risk.types import TelemetryProvenance, TelemetryReading

logger = logging.getLogger(__name__)


class TelemetrySimulator:
    """Generates deterministic, synthetic sensor telemetry strictly tagged as SIMULATED."""

    def __init__(self, random_seed: int = 42):
        self.rng = np.random.default_rng(seed=random_seed)

    def generate_zone_readings(
        self,
        zone_id: str,
        scenario: str = "BASELINE_DRY",
        duration_hours: int = 72,
        interval_minutes: int = 60,
        end_time: Optional[datetime] = None,
    ) -> List[TelemetryReading]:
        """Generate time-series telemetry readings for a zone under a defined scenario.

        Available Scenarios:
            - 'BASELINE_DRY': 0.0 - 2.0 mm/h rain, ~25% soil moisture
            - 'MODERATE_SHOWERS': 5.0 - 15.0 mm/h rain, ~55% soil moisture
            - 'HEAVY_MONSOON_BURST': 20.0 - 45.0 mm/h rain, ~85% soil moisture (Threshold-crossing)
        """
        end_dt = end_time or datetime.now(timezone.utc)
        total_steps = int((duration_hours * 60) / interval_minutes)
        readings: List[TelemetryReading] = []

        for step in range(total_steps):
            step_time = end_dt - timedelta(minutes=(total_steps - 1 - step) * interval_minutes)

            if scenario == "HEAVY_MONSOON_BURST":
                # Intensifying storm pattern in the last 24 hours
                hours_from_end = (end_dt - step_time).total_seconds() / 3600.0
                if hours_from_end <= 24:
                    rain_rate = float(self.rng.uniform(15.0, 45.0))
                    soil_moisture = float(self.rng.uniform(75.0, 92.0))
                else:
                    rain_rate = float(self.rng.uniform(2.0, 10.0))
                    soil_moisture = float(self.rng.uniform(45.0, 60.0))

            elif scenario == "MODERATE_SHOWERS":
                rain_rate = float(self.rng.uniform(2.0, 12.0))
                soil_moisture = float(self.rng.uniform(40.0, 60.0))

            else:  # BASELINE_DRY
                rain_rate = float(self.rng.uniform(0.0, 1.5)) if self.rng.random() < 0.2 else 0.0
                soil_moisture = float(self.rng.uniform(20.0, 35.0))

            readings.append(TelemetryReading(
                zone_id=zone_id,
                timestamp_utc=step_time,
                rainfall_rate_mm_h=round(rain_rate, 2),
                soil_moisture_pct=round(soil_moisture, 2),
                provenance=TelemetryProvenance.SIMULATED,
            ))

        return readings
