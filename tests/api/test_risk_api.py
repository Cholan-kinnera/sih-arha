"""Unit Tests for Dynamic Risk Evaluation Endpoints."""

from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_get_zone_risk_on_demand(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/risk/ZONE-SIKKIM-EAST_SIKKIM")
    assert response.status_code == 200
    data = response.json()
    assert data["zone_id"] == "ZONE-SIKKIM-EAST_SIKKIM"
    assert data["district"] == "EAST SIKKIM"
    assert 0.0 <= data["dynamic_risk_score"] <= 1.0
    assert data["severity_level"] in ("LOW", "MODERATE", "HIGH", "CRITICAL")
    assert data["degraded_mode"] is True
    assert "TERRAIN_DATA_UNAVAILABLE" in data["degraded_reasons"]
    assert "scientific_disclaimer" in data


def test_get_current_risk_matrix(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/risk/current")
    assert response.status_code == 200
    data = response.json()
    assert data["total_zones"] >= 1
    assert "severity_distribution" in data
    assert len(data["evaluations"]) >= 1
