"""Unit Tests for Risk Evidence Bundles, Simulator Scenarios, and Audit Trails."""

import pytest
import pandas as pd
from simulator.telemetry_simulator import TelemetrySimulator
from src.risk.engine import DynamicRiskEngine
from src.risk.types import SeverityLevel, TelemetryProvenance
from ml.config import DEFAULT_DATASET_PATH


@pytest.fixture
def baseline_sample():
    df = pd.read_parquet(DEFAULT_DATASET_PATH)
    return df.iloc[0].to_dict()


def test_telemetry_simulator_scenarios():
    sim = TelemetrySimulator(random_seed=42)

    # 1. Baseline Dry
    dry_readings = sim.generate_zone_readings("ZONE-DRY", scenario="BASELINE_DRY", duration_hours=72)
    assert len(dry_readings) == 72
    assert all(r.provenance == TelemetryProvenance.SIMULATED for r in dry_readings)
    max_dry_rain = max(r.rainfall_rate_mm_h for r in dry_readings)
    assert max_dry_rain < 5.0

    # 2. Heavy Monsoon Burst
    burst_readings = sim.generate_zone_readings("ZONE-BURST", scenario="HEAVY_MONSOON_BURST", duration_hours=72)
    assert len(burst_readings) == 72
    max_burst_rain = max(r.rainfall_rate_mm_h for r in burst_readings)
    assert max_burst_rain > 15.0


def test_evidence_bundle_completeness_under_heavy_storm(baseline_sample):
    sim = TelemetrySimulator(random_seed=42)
    burst_readings = sim.generate_zone_readings("ZONE-GANGTOK-01", scenario="HEAVY_MONSOON_BURST")

    engine = DynamicRiskEngine()
    bundle = engine.evaluate_zone_risk(
        zone_id="ZONE-GANGTOK-01",
        state="SIKKIM",
        district="EAST SIKKIM",
        static_features=baseline_sample,
        rainfall_readings=burst_readings,
        soil_moisture_pct=88.0,
    )

    assert bundle.zone_id == "ZONE-GANGTOK-01"
    assert bundle.evaluation.provenance == TelemetryProvenance.SIMULATED
    assert bundle.evaluation.severity_level in {SeverityLevel.MODERATE, SeverityLevel.HIGH, SeverityLevel.CRITICAL}
    assert len(bundle.audit_trail) > 0
    assert "scientific_disclaimer" in bundle.evaluation.model_dump()
    assert "DISCLAIMER" in bundle.evaluation.scientific_disclaimer
