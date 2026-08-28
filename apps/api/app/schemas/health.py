"""Health Check Pydantic Schemas."""

from __future__ import annotations

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Structured response for health check endpoint."""

    status: str = Field(..., description="Overall service status ('healthy', 'degraded')")
    database: str = Field(..., description="Database connectivity status ('connected', 'disconnected')")
    environment: str = Field("development", description="Runtime environment")
    version: str = Field("0.1.0", description="API Version")
