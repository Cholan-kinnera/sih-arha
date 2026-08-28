"""Unit Tests for Data Source Registry Endpoints."""

from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_list_data_sources(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/sources")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 5
    source_ids = [s["source_id"] for s in data["sources"]]
    assert "SRC-IMD-NORMALS" in source_ids
    assert "SRC-GSI-LANDSLIDES" in source_ids


def test_get_data_source_detail(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/sources/SRC-IMD-NORMALS")
    assert response.status_code == 200
    data = response.json()
    assert data["source_id"] == "SRC-IMD-NORMALS"
    assert data["status"] in ("CONNECTED", "ONLINE")
