"""Unit Tests for Dynamic Rainfall Accumulator and Intensity Factors."""

import pytest
from datetime import datetime, timedelta, timezone
from src.risk.rainfall import RainfallAccumulator, compute_rainfall_factor
from src.risk.types import DataFreshnessStatus, RainfallAccumulation, TelemetryProvenance, TelemetryReading


def test_rainfall_empty_readings():
    acc = RainfallAccumulator.calculate_from_readings([])
    assert acc.rainfall_24h_mm == 0.0
    assert acc.rainfall_72h_mm == 0.0
    assert acc.freshness == DataFreshnessStatus.MISSING

    factor = compute_rainfall_factor(acc)
    assert factor == 0.0


def test_rainfall_accumulation_windows():
    now = datetime.now(timezone.utc)
    readings = [
        TelemetryReading(zone_id="Z1", timestamp_utc=now - timedelta(hours=70), rainfall_rate_mm_h=10.0, provenance=TelemetryProvenance.SIMULATED),
        TelemetryReading(zone_id="Z1", timestamp_utc=now - timedelta(hours=30), rainfall_rate_mm_h=20.0, provenance=TelemetryProvenance.SIMULATED),
        TelemetryReading(zone_id="Z1", timestamp_utc=now - timedelta(hours=10), rainfall_rate_mm_h=30.0, provenance=TelemetryProvenance.SIMULATED),
        TelemetryReading(zone_id="Z1", timestamp_utc=now - timedelta(hours=2), rainfall_rate_mm_h=40.0, provenance=TelemetryProvenance.SIMULATED),
    ]

    acc = RainfallAccumulator.calculate_from_readings(readings, as_of_time=now)

    # 1h: 0.0 (oldest is 2h)
    assert acc.rainfall_1h_mm == 0.0
    # 6h: 40.0
    assert acc.rainfall_6h_mm == 40.0
    # 24h: 30 + 40 = 70.0
    assert acc.rainfall_24h_mm == 70.0
    # 48h: 20 + 30 + 40 = 90.0
    assert acc.rainfall_48h_mm == 90.0
    # 72h: 10 + 20 + 30 + 40 = 100.0
    assert acc.rainfall_72h_mm == 100.0

    assert acc.freshness == DataFreshnessStatus.SIMULATED


def test_rainfall_factor_normalization_and_clamping():
    # Moderate rain
    acc_mod = RainfallAccumulation(
        rainfall_1h_mm=10.0, rainfall_6h_mm=25.0, rainfall_24h_mm=75.0,
        rainfall_48h_mm=100.0, rainfall_72h_mm=120.0,
    )
    factor_mod = compute_rainfall_factor(acc_mod)
    assert 0.0 <= factor_mod <= 1.0

    # Extreme storm: exceeding 150mm/24h and 200mm/72h
    acc_ext = RainfallAccumulation(
        rainfall_1h_mm=50.0, rainfall_6h_mm=120.0, rainfall_24h_mm=250.0,
        rainfall_48h_mm=300.0, rainfall_72h_mm=400.0,
    )
    factor_ext = compute_rainfall_factor(acc_ext)
    assert factor_ext == 1.0
