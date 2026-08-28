"""Unit Tests for Dynamic Risk Engine Calculations and Degraded Mode."""

import pytest
import pandas as pd
from src.risk.engine import DynamicRiskEngine, map_score_to_severity
from src.risk.types import SeverityLevel, TelemetryProvenance, TelemetryReading
from ml.config import DEFAULT_DATASET_PATH


@pytest.fixture
def baseline_sample():
    df = pd.read_parquet(DEFAULT_DATASET_PATH)
    return df.iloc[0].to_dict()


def test_map_score_to_severity_canonical_bands():
    assert map_score_to_severity(0.0) == SeverityLevel.LOW
    assert map_score_to_severity(0.29) == SeverityLevel.LOW
    assert map_score_to_severity(0.30) == SeverityLevel.MODERATE
    assert map_score_to_severity(0.59) == SeverityLevel.MODERATE
    assert map_score_to_severity(0.60) == SeverityLevel.HIGH
    assert map_score_to_severity(0.79) == SeverityLevel.HIGH
    assert map_score_to_severity(0.80) == SeverityLevel.CRITICAL
    assert map_score_to_severity(1.0) == SeverityLevel.CRITICAL


def test_dynamic_risk_engine_degraded_mode_when_terrain_absent(baseline_sample):
    engine = DynamicRiskEngine()

    bundle = engine.evaluate_zone_risk(
        zone_id="ZONE-TEST-01",
        state="SIKKIM",
        district="EAST SIKKIM",
        static_features=baseline_sample,
        rainfall_readings=[],
        soil_moisture_pct=None,
        terrain_features=None,
    )

    eval_res = bundle.evaluation
    assert 0.0 <= eval_res.dynamic_risk_score <= 1.0
    assert eval_res.degraded_mode is True
    assert "TERRAIN_DATA_UNAVAILABLE" in eval_res.degraded_reasons
    assert "SOIL_MOISTURE_UNAVAILABLE" in eval_res.degraded_reasons

    # Verify weights sum to 1.0
    assert abs(sum(eval_res.factor_weights_used.values()) - 1.0) < 1e-3


def test_dynamic_risk_engine_all_factors_active(baseline_sample):
    engine = DynamicRiskEngine()

    terrain_sample = {
        "terrain_coverage": True,
        "mean_slope_deg": 32.0,
        "mean_tri": 20.0,
    }

    readings = [
        TelemetryReading(zone_id="Z1", timestamp_utc=pd.Timestamp.now(tz="UTC"), rainfall_rate_mm_h=25.0)
    ]

    bundle = engine.evaluate_zone_risk(
        zone_id="ZONE-TEST-02",
        state="SIKKIM",
        district="EAST SIKKIM",
        static_features=baseline_sample,
        rainfall_readings=readings,
        soil_moisture_pct=75.0,
        terrain_features=terrain_sample,
    )

    eval_res = bundle.evaluation
    assert 0.0 <= eval_res.dynamic_risk_score <= 1.0
    assert eval_res.degraded_mode is False
    assert eval_res.contributing_factors.terrain_factor is not None
    assert eval_res.contributing_factors.soil_moisture_factor is not None
    assert len(eval_res.factor_weights_used) == 5
