"""Unit Tests for Telemetry Ingestion and Validation."""

from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_ingest_telemetry_simulated(client: TestClient):
    payload = {
        "sensor_id": "SENS-TEST-RAIN-01",
        "zone_id": "ZONE-SIKKIM-EAST_SIKKIM",
        "measurement_type": "rainfall_rate_mm_h",
        "value": 15.5,
        "unit": "mm/h",
        "provenance": "SIMULATED",
    }
    response = client.post(f"{settings.API_V1_STR}/telemetry", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "INGESTED_SUCCESSFULLY"
    assert data["zone_risk_updated"] is True
    assert data["dynamic_risk_score"] is not None


def test_ingest_telemetry_invalid_provenance(client: TestClient):
    payload = {
        "sensor_id": "SENS-BAD-01",
        "zone_id": "ZONE-SIKKIM-EAST_SIKKIM",
        "measurement_type": "rainfall_rate_mm_h",
        "value": 5.0,
        "unit": "mm/h",
        "provenance": "UNTRUSTED_FAKE",
    }
    response = client.post(f"{settings.API_V1_STR}/telemetry", json=payload)
    assert response.status_code == 422


def test_websocket_telemetry_stream(client: TestClient):
    with client.websocket_connect(f"{settings.API_V1_STR}/ws/telemetry") as websocket:
        websocket.send_text("ping")
        data = websocket.receive_text()
        assert data == "pong"
