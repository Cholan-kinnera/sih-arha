from fastapi import APIRouter
from pydantic import BaseModel

api_v1_router = APIRouter()


class HealthResponse(BaseModel):
    """Structured health check response model."""
    status: str = "ok"
    version: str = "0.1.0"
    environment: str = "development"


@api_v1_router.get("/health", response_model=HealthResponse, tags=["Health"])
async def v1_health_check() -> HealthResponse:
    """Versioned health check endpoint."""
    return HealthResponse(status="ok")
