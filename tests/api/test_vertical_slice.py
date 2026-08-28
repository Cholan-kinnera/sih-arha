"""End-to-End Vertical Slice Integration Test for LEWS Backend.

Demonstrates complete data and risk flow:
SIMULATED TELEMETRY
        ↓
POST /api/v1/telemetry
        ↓
Database Persistence (TelemetryReadingModel)
        ↓
Rainfall Accumulation (RainfallAccumulator)
        ↓
Dynamic Risk Engine (DynamicRiskEngine + SusceptibilityPredictor)
        ↓
Risk Evaluation Persistence (RiskEvaluationModel)
        ↓
Alert Evaluation (AlertModel + AlertAuditHistoryModel)
        ↓
GET /api/v1/risk/{zone_id}
        ↓
GET /api/v1/alerts
"""

import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_complete_vertical_slice_flow(client: TestClient):
    zone_id = "ZONE-SIKKIM-EAST_SIKKIM"

    # Step 1: Ingest SIMULATED telemetry reading (burst rainfall)
    now = datetime.now(timezone.utc)
    ingest_payload = {
        "sensor_id": "SENS-GANGTOK-PRECIP-01",
        "zone_id": zone_id,
        "timestamp_utc": now.isoformat(),
        "measurement_type": "rainfall_rate_mm_h",
        "value": 85.0,
        "unit": "mm/h",
        "provenance": "SIMULATED",
        "metadata_json": {"station_name": "Gangtok Ridge AWS", "elevation_m": 1650},
    }

    post_resp = client.post(f"{settings.API_V1_STR}/telemetry", json=ingest_payload)
    assert post_resp.status_code == 201
    post_data = post_resp.json()
    assert post_data["status"] == "INGESTED_SUCCESSFULLY"
    assert post_data["zone_risk_updated"] is True
    assert post_data["provenance"] == "SIMULATED"
    assert post_data["dynamic_risk_score"] is not None

    # Step 2: Query GET /api/v1/risk/{zone_id} to verify dynamic risk evaluation & evidence
    risk_resp = client.get(f"{settings.API_V1_STR}/risk/{zone_id}")
    assert risk_resp.status_code == 200
    risk_data = risk_resp.json()
    assert risk_data["zone_id"] == zone_id
    assert risk_data["state"] == "SIKKIM"
    assert risk_data["district"] == "EAST SIKKIM"
    assert 0.0 <= risk_data["dynamic_risk_score"] <= 1.0
    assert risk_data["severity_level"] in ("HIGH", "CRITICAL")
    assert risk_data["provenance"] == "SIMULATED"
    assert risk_data["degraded_mode"] is True  # because terrain DEM is unmounted (scientific truthfulness)
    assert "scientific_disclaimer" in risk_data

    # Step 3: Query GET /api/v1/alerts to verify alert triggered by threshold crossing
    alerts_resp = client.get(f"{settings.API_V1_STR}/alerts?zone_id={zone_id}")
    assert alerts_resp.status_code == 200
    alerts_data = alerts_resp.json()
    assert alerts_data["total"] >= 1
    triggered_alert = alerts_data["alerts"][0]
    assert triggered_alert["zone_id"] == zone_id
    assert triggered_alert["severity"] in ("HIGH", "CRITICAL")
    assert triggered_alert["status"] in ("ACTIVE", "PENDING_REVIEW", "ACKNOWLEDGED")

    # Step 4: Acknowledge alert and verify audit trail
    alert_id = triggered_alert["alert_id"]
    ack_resp = client.post(
        f"{settings.API_V1_STR}/alerts/{alert_id}/acknowledge",
        json={"operator_id": "NDRF-OFFICER-01", "notes": "Alert dispatched to Sikkim State Disaster Management Authority."},
    )
    assert ack_resp.status_code == 200
    assert ack_resp.json()["status"] == "ACKNOWLEDGED"

    audit_resp = client.get(f"{settings.API_V1_STR}/alerts/{alert_id}/audit")
    assert audit_resp.status_code == 200
    audit_trail = audit_resp.json()
    assert any(a["action"] == "ALERT_GENERATED" for a in audit_trail)
    assert any(a["action"] == "ALERT_ACKNOWLEDGED" for a in audit_trail)
