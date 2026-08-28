"""Unit Tests for Zone & Catchment Endpoints."""

from fastapi.testclient import TestClient
from apps.api.app.config import settings


def test_list_zones_pagination(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/zones?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 641
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert len(data["zones"]) == 10


def test_list_zones_filter_ner_and_state(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/zones?state=SIKKIM&is_ner=true")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 4
    for z in data["zones"]:
        assert z["state"] == "SIKKIM"
        assert z["is_ner"] is True


def test_list_zones_search(client: TestClient):
    response = client.get(f"{settings.API_V1_STR}/zones?search=EAST_SIKKIM")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any(z["district"] == "EAST SIKKIM" for z in data["zones"])


def test_get_zone_by_id_success_and_not_found(client: TestClient):
    # Success
    response = client.get(f"{settings.API_V1_STR}/zones/ZONE-SIKKIM-EAST_SIKKIM")
    assert response.status_code == 200
    data = response.json()
    assert data["zone_id"] == "ZONE-SIKKIM-EAST_SIKKIM"
    assert data["district"] == "EAST SIKKIM"
    assert data["terrain"] is not None
    assert data["terrain"]["terrain_coverage"] is False

    # Not Found
    response_404 = client.get(f"{settings.API_V1_STR}/zones/ZONE-NONEXISTENT")
    assert response_404.status_code == 404
