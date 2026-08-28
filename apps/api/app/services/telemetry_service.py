"""Telemetry Ingestion Pipeline & WebSocket Broadcast Manager (Async)."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import WebSocket
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.models.sensor import SensorModel
from apps.api.app.db.models.telemetry import TelemetryReadingModel
from apps.api.app.db.models.zone import Zone
from apps.api.app.schemas.telemetry import (
    TelemetryIngestRequest,
    TelemetryIngestResponse,
    WebSocketTelemetryMessage,
)
from apps.api.app.services.risk_service import evaluate_and_persist_zone_risk

logger = logging.getLogger(__name__)


class WebSocketConnectionManager:
    """Thread-safe WebSocket client manager for live telemetry streaming."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info("WebSocket client connected. Active connections: %d", len(self.active_connections))

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info("WebSocket client disconnected. Remaining connections: %d", len(self.active_connections))

    async def broadcast_json(self, message: dict) -> None:
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning("Error broadcasting to WebSocket client: %s", e)
                disconnected.append(connection)

        for dead in disconnected:
            self.disconnect(dead)


ws_manager = WebSocketConnectionManager()


async def ingest_telemetry_reading(
    db: AsyncSession,
    request: TelemetryIngestRequest,
) -> TelemetryIngestResponse:
    """Ingest a single telemetry reading, persist it, update zone risk, and evaluate alerts."""
    timestamp = request.timestamp_utc or datetime.now(timezone.utc)

    # 1. Resolve Zone UUID
    z_stmt = select(Zone).where(Zone.zone_id == request.zone_id)
    zone = (await db.scalars(z_stmt)).first()
    zone_uuid = zone.id if zone else None

    # 2. Resolve or Register Sensor
    s_stmt = select(SensorModel).where(SensorModel.sensor_id == request.sensor_id)
    sensor = (await db.scalars(s_stmt)).first()
    if not sensor:
        sensor = SensorModel(
            id=uuid.uuid4(),
            sensor_id=request.sensor_id,
            zone_id=zone_uuid,
            name=f"Sensor {request.sensor_id}",
            sensor_type=request.measurement_type,
            status="CONNECTED",
            installed_at=timestamp,
            metadata_json=request.metadata_json,
        )
        db.add(sensor)
        await db.flush()

    sensor_uuid = sensor.id

    # 3. Save Telemetry Reading
    reading = TelemetryReadingModel(
        sensor_id=sensor_uuid,
        zone_id=zone_uuid,
        timestamp=timestamp,
        measurement_type=request.measurement_type,
        value=request.value,
        unit=request.unit,
        provenance=request.provenance,
        metadata_json=request.metadata_json,
        created_at=datetime.now(timezone.utc),
    )
    db.add(reading)
    await db.commit()
    await db.refresh(reading)

    # 4. Trigger Dynamic Risk Evaluation for Zone
    bundle = await evaluate_and_persist_zone_risk(db, zone_id_str=request.zone_id, as_of_time=timestamp)

    dynamic_score = None
    severity = None
    alert_triggered = False
    alert_id = None

    if bundle:
        dynamic_score = bundle.evaluation.dynamic_risk_score
        severity = bundle.evaluation.severity_level.value
        if severity in ("HIGH", "CRITICAL"):
            alert_triggered = True

    logger.info(
        "Ingested telemetry for zone %s (%s=%.2f %s, Provenance: %s). New Risk: %s",
        request.zone_id,
        request.measurement_type,
        request.value,
        request.unit,
        request.provenance,
        f"{dynamic_score:.2f} ({severity})" if dynamic_score is not None else "N/A",
    )

    # Broadcast real-time update to all connected WebSocket clients
    try:
        import asyncio
        loop = asyncio.get_running_loop()
        ws_payload = {
            "type": "TELEMETRY_UPDATE",
            "timestamp_utc": timestamp.isoformat(),
            "zone_id": request.zone_id,
            "sensor_id": request.sensor_id,
            "measurement_type": request.measurement_type,
            "value": request.value,
            "unit": request.unit,
            "provenance": request.provenance,
            "dynamic_risk_score": dynamic_score,
            "severity_level": severity,
            "alert_triggered": alert_triggered,
        }
        loop.create_task(ws_manager.broadcast_json(ws_payload))
    except RuntimeError:
        pass

    return TelemetryIngestResponse(
        status="INGESTED_SUCCESSFULLY",
        sensor_id=request.sensor_id,
        zone_id=request.zone_id,
        measurement_type=request.measurement_type,
        value=request.value,
        unit=request.unit,
        provenance=request.provenance,
        zone_risk_updated=bundle is not None,
        dynamic_risk_score=dynamic_score,
        severity_level=severity,
        alert_triggered=alert_triggered,
        alert_id=alert_id,
    )
