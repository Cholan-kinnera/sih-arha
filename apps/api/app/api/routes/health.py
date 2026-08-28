"""Health Check Route (Async)."""

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.config import settings
from apps.api.app.db.session import check_async_db_connectivity, get_async_db
from apps.api.app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check endpoint",
)
async def health_check(db: AsyncSession = Depends(get_async_db)) -> JSONResponse:
    """Returns application status and verifies async database connectivity."""
    db_connected = await check_async_db_connectivity(db)

    payload = {
        "status": "healthy" if db_connected else "degraded",
        "database": "connected" if db_connected else "disconnected",
        "environment": settings.ENVIRONMENT,
        "version": "0.1.0",
    }
    return JSONResponse(
        status_code=status.HTTP_200_OK if db_connected else status.HTTP_503_SERVICE_UNAVAILABLE,
        content=payload,
    )
