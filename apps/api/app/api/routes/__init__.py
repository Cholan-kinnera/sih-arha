"""API Routes Package Exports."""

from apps.api.app.api.routes.alerts import router as alerts_router
from apps.api.app.api.routes.data_sources import router as data_sources_router
from apps.api.app.api.routes.health import router as health_router
from apps.api.app.api.routes.risk import router as risk_router
from apps.api.app.api.routes.telemetry import router as telemetry_router
from apps.api.app.api.routes.zones import router as zones_router

__all__ = [
    "health_router",
    "zones_router",
    "risk_router",
    "telemetry_router",
    "alerts_router",
    "data_sources_router",
]
