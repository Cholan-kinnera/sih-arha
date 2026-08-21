from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from apps.api.src.api_v1.router import api_v1_router
from apps.api.src.core.config import settings
from apps.api.src.core.logging import logger


class RootHealthResponse(BaseModel):
    """Minimal structured response for GET /health."""
    status: str = "ok"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifespan context manager."""
    logger.info("Starting %s in [%s] mode...", settings.PROJECT_NAME, settings.ENVIRONMENT)
    yield
    logger.info("Shutting down %s...", settings.PROJECT_NAME)


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="0.1.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan,
    )

    # Configure CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Health Endpoint
    @app.get("/health", response_model=RootHealthResponse, tags=["Health"])
    async def root_health_check() -> Dict[str, str]:
        """Root health check endpoint."""
        return {"status": "ok"}

    # Include Versioned API Router
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)

    return app


app = create_app()
