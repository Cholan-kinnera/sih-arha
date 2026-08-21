import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app


def test_app_import_and_instantiation():
    """Verify application imports cleanly and initializes."""
    assert app is not None
    assert app.title == "Citizen Benefits Intelligence Platform API"


def test_root_health_check_sync():
    """Test GET /health returns HTTP 200 and status ok (Sync client)."""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_v1_health_check_sync():
    """Test GET /api/v1/health returns HTTP 200."""
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


@pytest.mark.asyncio
async def test_root_health_check_async(async_client):
    """Test GET /health via AsyncClient."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
