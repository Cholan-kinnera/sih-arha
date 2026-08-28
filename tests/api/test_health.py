"""Unit Tests for Health Check Endpoint."""

from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_health_check_healthy(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "ok")
    assert data["database"] == "connected"
    assert data["version"] == "0.1.0"


def test_api_v1_health_check(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "ok")
    assert data["database"] == "connected"
