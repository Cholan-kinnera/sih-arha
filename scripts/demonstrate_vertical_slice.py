"""Demonstration Script for Phase 6 End-to-End Vertical Slice.

Executes:
SIMULATED TELEMETRY
        ↓
POST /api/v1/telemetry
        ↓
Database Persistence
        ↓
Rainfall Accumulation
        ↓
Dynamic Risk Engine
        ↓
Risk Evaluation Persistence
        ↓
Alert Generation
        ↓
GET /api/v1/risk/{zone_id}
        ↓
GET /api/v1/alerts
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from apps.api.app.main import app

def run_demonstration():
    client = TestClient(app)

    print("\n" + "="*80)
    print("LEWS PHASE 6: VERTICAL INTEGRATION DEMONSTRATION")
    print("="*80)

    # 1. Health check
    res_health = client.get("/health")
    print("\n--- [1] GET /health ---")
    print(f"Status Code: {res_health.status_code}")
    print("Response Body:")
    print(json.dumps(res_health.json(), indent=2))

    # 2. Ingest SIMULATED telemetry reading for Gangtok (East Sikkim)
    zone_id = "ZONE-SIKKIM-EAST_SIKKIM"
    telemetry_payload = {
        "sensor_id": "SENS-GANGTOK-PRECIP-DEMO",
        "zone_id": zone_id,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "measurement_type": "rainfall_rate_mm_h",
        "value": 110.0,
        "unit": "mm/h",
        "provenance": "SIMULATED",
        "metadata_json": {
            "station": "Gangtok AWS 01",
            "weather_condition": "Monsoon Cloudburst Simulation"
        }
    }

    print(f"\n--- [2] POST /api/v1/telemetry (Ingest Cloudburst Telemetry for {zone_id}) ---")
    print("Request Payload:")
    print(json.dumps(telemetry_payload, indent=2))

    res_post = client.post("/api/v1/telemetry", json=telemetry_payload)
    print(f"\nResponse (Status {res_post.status_code}):")
    print(json.dumps(res_post.json(), indent=2))

    # 3. Query Dynamic Risk for Zone
    print(f"\n--- [3] GET /api/v1/risk/{zone_id} (Dynamic Multi-Factor Risk Evaluation) ---")
    res_risk = client.get(f"/api/v1/risk/{zone_id}")
    print(f"Response (Status {res_risk.status_code}):")
    print(json.dumps(res_risk.json(), indent=2))

    # 4. Query Alerts for Zone
    print(f"\n--- [4] GET /api/v1/alerts?zone_id={zone_id} (Triggered Operational Alerts) ---")
    res_alerts = client.get(f"/api/v1/alerts?zone_id={zone_id}")
    print(f"Response (Status {res_alerts.status_code}):")
    print(json.dumps(res_alerts.json(), indent=2))

    # 5. Acknowledge Alert if present
    alerts = res_alerts.json().get("alerts", [])
    if alerts:
        alert_id = alerts[0]["alert_id"]
        ack_payload = {
            "operator_id": "NDRF-COMMAND-CENTER-01",
            "notes": "Field team dispatched to Gangtok bypass corridor. High alert issued to SDMA."
        }
        print(f"\n--- [5] POST /api/v1/alerts/{alert_id}/acknowledge (Operator Acknowledgment) ---")
        res_ack = client.post(f"/api/v1/alerts/{alert_id}/acknowledge", json=ack_payload)
        print(f"Response (Status {res_ack.status_code}):")
        print(json.dumps(res_ack.json(), indent=2))

        # 6. Audit Trail
        print(f"\n--- [6] GET /api/v1/alerts/{alert_id}/audit (Immutable Audit Trail) ---")
        res_audit = client.get(f"/api/v1/alerts/{alert_id}/audit")
        print(f"Response (Status {res_audit.status_code}):")
        print(json.dumps(res_audit.json(), indent=2))

    print("\n" + "="*80)
    print("VERTICAL INTEGRATION DEMONSTRATION FINISHED SUCCESSFULLY")
    print("="*80 + "\n")

if __name__ == "__main__":
    run_demonstration()
