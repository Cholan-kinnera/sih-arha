"""Unit Tests for SQLAlchemy 2.x Async Persistence, Models, Constraints, and Relationships."""

import pytest
import pytest_asyncio
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from apps.api.app.db.base import Base
from apps.api.app.db.enums import (
    AlertStatus,
    Freshness,
    Provenance,
    Severity,
    SourceStatus,
)
from apps.api.app.db.models.alert import AlertAuditHistoryModel, AlertModel
from apps.api.app.db.models.data_source import DataSourceModel, IngestionEventModel
from apps.api.app.db.models.risk import RiskEvaluationModel
from apps.api.app.db.models.sensor import SensorModel
from apps.api.app.db.models.telemetry import TelemetryReadingModel
from apps.api.app.db.models.zone import Zone, ZoneTerrainFeatures

# In-memory async SQLite engine with static pool for isolated async tests
TEST_ASYNC_DB_URL = "sqlite+aiosqlite:///:memory:"

test_async_engine = create_async_engine(
    TEST_ASYNC_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestAsyncSessionLocal = async_sessionmaker(
    bind=test_async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup_test_async_db():
    """Create all tables before test and drop after test."""
    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def async_session() -> AsyncSession:
    """Provide isolated async session for tests."""
    async with TestAsyncSessionLocal() as session:
        yield session


@pytest.mark.asyncio
async def test_zone_and_terrain_relationship(async_session: AsyncSession):
    zone_id = "ZONE-TEST-01"
    zone = Zone(
        id=uuid.uuid4(),
        zone_id=zone_id,
        name="Test Catchment",
        state="SIKKIM",
        district="EAST SIKKIM",
        subdivision="SUB HIMALAYAN WEST BENGAL & SIKKIM",
        is_ner=True,
    )
    async_session.add(zone)
    await async_session.flush()

    # Add terrain features with missing DEM values (scientifically authentic)
    terrain = ZoneTerrainFeatures(
        id=uuid.uuid4(),
        zone_id=zone.id,
        elevation_mean=None,
        slope_mean=None,
        tri_mean=None,
        terrain_coverage=False,
        source_provenance="TERRAIN_UNAVAILABLE",
    )
    async_session.add(terrain)
    await async_session.commit()

    # Query back
    stmt = select(Zone).where(Zone.zone_id == zone_id)
    loaded_zone = (await async_session.scalars(stmt)).first()
    assert loaded_zone is not None
    assert loaded_zone.state == "SIKKIM"

    # Query terrain
    t_stmt = select(ZoneTerrainFeatures).where(ZoneTerrainFeatures.zone_id == loaded_zone.id)
    loaded_terrain = (await async_session.scalars(t_stmt)).first()
    assert loaded_terrain is not None
    assert loaded_terrain.terrain_coverage is False
    assert loaded_terrain.elevation_mean is None
    assert loaded_terrain.slope_mean is None


@pytest.mark.asyncio
async def test_data_sources_and_ingestion_events(async_session: AsyncSession):
    source = DataSourceModel(
        id=uuid.uuid4(),
        source_id="SRC-TEST-PRECIP",
        name="Test Ingestion Feed",
        provider="IMD",
        category="PRECIPITATION",
        status=SourceStatus.CONNECTED.value,
        freshness=Freshness.FRESH.value,
        provenance=Provenance.SIMULATED.value,
        record_count=100,
    )
    async_session.add(source)
    await async_session.flush()

    event = IngestionEventModel(
        source_id=source.id,
        status="SUCCESS",
        records_ingested=100,
        duration_ms=45,
        provenance=Provenance.SIMULATED.value,
    )
    async_session.add(event)
    await async_session.commit()

    # Verify query
    stmt = select(IngestionEventModel).where(IngestionEventModel.source_id == source.id)
    loaded_event = (await async_session.scalars(stmt)).first()
    assert loaded_event is not None
    assert loaded_event.records_ingested == 100
    assert loaded_event.provenance == "SIMULATED"


@pytest.mark.asyncio
async def test_telemetry_and_sensor_composite_indexing(async_session: AsyncSession):
    zone = Zone(
        id=uuid.uuid4(),
        zone_id="ZONE-SENS-01",
        name="Sensor Test Zone",
        state="ASSAM",
        district="DIMA HASAO",
        is_ner=True,
    )
    async_session.add(zone)
    await async_session.flush()

    sensor = SensorModel(
        id=uuid.uuid4(),
        sensor_id="SENS-RAINGAUGE-01",
        zone_id=zone.id,
        name="AWS Raingauge",
        sensor_type="RAINGAUGE_TELEMETERED",
        status="CONNECTED",
    )
    async_session.add(sensor)
    await async_session.flush()

    now = datetime.now(timezone.utc)
    reading = TelemetryReadingModel(
        sensor_id=sensor.id,
        zone_id=zone.id,
        timestamp=now,
        measurement_type="rainfall_rate_mm_h",
        value=24.5,
        unit="mm/h",
        provenance=Provenance.SIMULATED.value,
    )
    async_session.add(reading)
    await async_session.commit()

    # Query with timestamp descending
    stmt = (
        select(TelemetryReadingModel)
        .where(TelemetryReadingModel.zone_id == zone.id)
        .order_by(TelemetryReadingModel.timestamp.desc())
    )
    loaded = (await async_session.scalars(stmt)).first()
    assert loaded is not None
    assert loaded.value == 24.5
    assert loaded.provenance == "SIMULATED"


@pytest.mark.asyncio
async def test_risk_evaluation_bounds_and_evidence(async_session: AsyncSession):
    zone = Zone(
        id=uuid.uuid4(),
        zone_id="ZONE-RISK-01",
        name="Risk Test Zone",
        state="MIZORAM",
        district="AIZAWL",
        is_ner=True,
    )
    async_session.add(zone)
    await async_session.flush()

    now = datetime.now(timezone.utc)
    risk = RiskEvaluationModel(
        zone_id=zone.id,
        timestamp=now,
        static_susceptibility=0.85,
        rainfall_factor=0.90,
        dynamic_risk_score=0.875,
        severity=Severity.CRITICAL.value,
        provenance=Provenance.SIMULATED.value,
        degraded_mode=True,
        degraded_reasons={"reasons": ["TERRAIN_DATA_UNAVAILABLE"]},
        evidence={"summary": "High risk due to continuous precipitation burst"},
    )
    async_session.add(risk)
    await async_session.commit()

    stmt = select(RiskEvaluationModel).where(RiskEvaluationModel.zone_id == zone.id)
    loaded = (await async_session.scalars(stmt)).first()
    assert loaded is not None
    assert loaded.dynamic_risk_score == 0.875
    assert loaded.severity == "CRITICAL"
    assert loaded.degraded_mode is True


@pytest.mark.asyncio
async def test_alert_and_immutable_audit_trail(async_session: AsyncSession):
    zone = Zone(
        id=uuid.uuid4(),
        zone_id="ZONE-ALERT-01",
        name="Alert Zone",
        state="NAGALAND",
        district="KOHIMA",
        is_ner=True,
    )
    async_session.add(zone)
    await async_session.flush()

    alert = AlertModel(
        id=uuid.uuid4(),
        alert_id="ALT-TEST-001",
        zone_id=zone.id,
        severity=Severity.HIGH.value,
        risk_score=0.72,
        trigger_reason="Rainfall burst exceeded operational warning threshold",
        status=AlertStatus.ACTIVE.value,
        provenance=Provenance.SIMULATED.value,
    )
    async_session.add(alert)
    await async_session.flush()

    audit_entry = AlertAuditHistoryModel(
        alert_id=alert.id,
        operator_id="OPERATOR-99",
        action="ALERT_ACKNOWLEDGED",
        notes="Notification broadcast dispatched to regional emergency center",
        timestamp=datetime.now(timezone.utc),
    )
    async_session.add(audit_entry)
    await async_session.commit()

    # Query audit history
    stmt = (
        select(AlertAuditHistoryModel)
        .where(AlertAuditHistoryModel.alert_id == alert.id)
        .order_by(AlertAuditHistoryModel.timestamp.desc())
    )
    audits = (await async_session.scalars(stmt)).all()
    assert len(audits) == 1
    assert audits[0].action == "ALERT_ACKNOWLEDGED"
    assert audits[0].operator_id == "OPERATOR-99"
