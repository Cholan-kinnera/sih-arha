"""LEWS Production FastAPI Application Entrypoint (Async)."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.app.api.routes import (
    alerts_router,
    data_sources_router,
    health_router,
    risk_router,
    telemetry_router,
    zones_router,
)
from apps.api.app.config import settings
from apps.api.app.db.base import Base
from apps.api.app.db.session import async_engine

logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL, logging.INFO), format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifespan context manager."""
    logger.info("Initializing %s in [%s] mode...", settings.PROJECT_NAME, settings.ENVIRONMENT)

    # Initialize tables if connected using async engine in non-testing mode
    if settings.ENVIRONMENT != "testing":
        try:
            async with async_engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables initialized successfully.")
        except Exception as e:
            logger.warning("Could not auto-create database tables on startup: %s", e)

    yield

    logger.info("Shutting down %s...", settings.PROJECT_NAME)
    if settings.ENVIRONMENT != "testing":
        try:
            await async_engine.dispose()
        except Exception:
            pass


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="0.1.0",
        description=(
            "AI-Based Landslide Early Warning & Risk Monitoring System for the "
            "North-Eastern Region of India (SIH26001). Provides real-time dynamic "
            "risk matrix, multi-factor evidence synthesis, telemetry ingestion, and alerts."
        ),
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

    # Mount Root Health Router
    app.include_router(health_router, prefix="")
    app.include_router(health_router, prefix=settings.API_V1_STR)

    # Mount Feature Routers under /api/v1
    app.include_router(zones_router, prefix=settings.API_V1_STR)
    app.include_router(risk_router, prefix=settings.API_V1_STR)
    app.include_router(telemetry_router, prefix=settings.API_V1_STR)
    app.include_router(alerts_router, prefix=settings.API_V1_STR)
    app.include_router(data_sources_router, prefix=settings.API_V1_STR)

    return app


app = create_app()
