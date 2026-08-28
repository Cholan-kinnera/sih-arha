"""Telemetry Ingestion and Real-Time WebSocket Routes (Async)."""

import logging
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.enums import Provenance
from apps.api.app.db.session import get_async_db
from apps.api.app.schemas.telemetry import (
    TelemetryIngestRequest,
    TelemetryIngestResponse,
)
from apps.api.app.services.telemetry_service import (
    ingest_telemetry_reading,
    ws_manager,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Telemetry"])


@router.post(
    "/telemetry",
    response_model=TelemetryIngestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest physical or simulated telemetry observation",
)
async def ingest_telemetry(
    request: TelemetryIngestRequest,
    db: AsyncSession = Depends(get_async_db),
) -> TelemetryIngestResponse:
    """Ingest sensor observation, update dynamic risk, and broadcast update over WebSocket."""
    allowed_provenance = {p.value for p in Provenance}
    if request.provenance not in allowed_provenance:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Invalid provenance '{request.provenance}'. Must be one of {allowed_provenance}",
        )

    return await ingest_telemetry_reading(db=db, request=request)


@router.websocket("/ws/telemetry")
async def websocket_telemetry_stream(websocket: WebSocket) -> None:
    """Real-time bi-directional WebSocket telemetry stream for operational dashboard."""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.warning("WebSocket connection encountered exception: %s", e)
        ws_manager.disconnect(websocket)
