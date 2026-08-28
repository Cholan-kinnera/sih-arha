"""Unit Tests for Alerting Engine, Acknowledgment, and Audit History."""

from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_alert_lifecycle_and_audit(client: TestClient):
    # 1. Ingest extreme burst of rainfall to trigger CRITICAL alert
    payload = {
        "sensor_id": "SENS-EXTREME-01",
        "zone_id": "ZONE-SIKKIM-EAST_SIKKIM",
        "measurement_type": "rainfall_rate_mm_h",
        "value": 120.0,
        "unit": "mm/h",
        "provenance": "SIMULATED",
    }
    ingest_res = client.post(f"{settings.API_V1_STR}/telemetry", json=payload)
    assert ingest_res.status_code == 201

    # 2. Query alerts
    alerts_res = client.get(f"{settings.API_V1_STR}/alerts?zone_id=ZONE-SIKKIM-EAST_SIKKIM")
    assert alerts_res.status_code == 200
    alerts_data = alerts_res.json()
    assert alerts_data["total"] >= 1

    alert = alerts_data["alerts"][0]
    alert_id = alert["alert_id"]
    assert alert["status"] in ("ACTIVE", "PENDING_REVIEW", "ACKNOWLEDGED")

    # 3. Acknowledge alert
    ack_payload = {
        "operator_id": "OP-TEST-42",
        "notes": "Field observation team dispatched to Gangtok bypass ridge.",
    }
    ack_res = client.post(f"{settings.API_V1_STR}/alerts/{alert_id}/acknowledge", json=ack_payload)
    assert ack_res.status_code == 200
    assert ack_res.json()["status"] == "ACKNOWLEDGED"

    # 4. Query audit trail
    audit_res = client.get(f"{settings.API_V1_STR}/alerts/{alert_id}/audit")
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    assert len(audit_data) >= 2
    actions = [a["action"] for a in audit_data]
    assert "ALERT_GENERATED" in actions
    assert "ALERT_ACKNOWLEDGED" in actions
