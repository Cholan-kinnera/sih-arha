"""Initial LEWS Production Database Schema with PostGIS.

Revision ID: 001_initial_schema
Revises: None
Create Date: 2026-08-28 21:40:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    is_postgres = conn.dialect.name == "postgresql"

    # 0. Enable PostGIS Extension if running on PostgreSQL
    if is_postgres:
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        poly_geom_type = Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True)
        point_geom_type = Geometry(geometry_type="POINT", srid=4326, spatial_index=True)
        json_type = postgresql.JSONB(astext_type=sa.Text())
    else:
        poly_geom_type = sa.Text()
        point_geom_type = sa.Text()
        json_type = sa.JSON()

    # 1. zones table
    op.create_table(
        "zones",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("zone_id", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("state", sa.String(length=64), nullable=False),
        sa.Column("district", sa.String(length=64), nullable=False),
        sa.Column("subdivision", sa.String(length=128), nullable=True),
        sa.Column("is_ner", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("geometry", poly_geom_type, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_zones_zone_id", "zones", ["zone_id"], unique=True)
    op.create_index("ix_zones_state", "zones", ["state"], unique=False)
    op.create_index("ix_zones_district", "zones", ["district"], unique=False)
    op.create_index("ix_zones_is_ner", "zones", ["is_ner"], unique=False)

    # 2. zone_terrain_features table
    op.create_table(
        "zone_terrain_features",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("zone_id", sa.Uuid(), nullable=False),
        sa.Column("elevation_mean", sa.Float(), nullable=True),
        sa.Column("elevation_min", sa.Float(), nullable=True),
        sa.Column("elevation_max", sa.Float(), nullable=True),
        sa.Column("elevation_std", sa.Float(), nullable=True),
        sa.Column("slope_mean", sa.Float(), nullable=True),
        sa.Column("slope_min", sa.Float(), nullable=True),
        sa.Column("slope_max", sa.Float(), nullable=True),
        sa.Column("slope_std", sa.Float(), nullable=True),
        sa.Column("aspect_mean", sa.Float(), nullable=True),
        sa.Column("tri_mean", sa.Float(), nullable=True),
        sa.Column("terrain_coverage", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("source_provenance", sa.String(length=64), nullable=False, server_default="TERRAIN_UNAVAILABLE"),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_zone_terrain_features_zone_id", "zone_terrain_features", ["zone_id"], unique=True)

    # 3. data_sources table
    op.create_table(
        "data_sources",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("source_id", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("provider", sa.String(length=64), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="CONNECTED"),
        sa.Column("freshness", sa.String(length=32), nullable=False, server_default="FRESH"),
        sa.Column("provenance", sa.String(length=32), nullable=False, server_default="HISTORICAL"),
        sa.Column("cadence", sa.String(length=64), nullable=True),
        sa.Column("last_ingested_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("record_count", sa.Integer(), nullable=True, server_default="0"),
        sa.Column("metadata", json_type, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_data_sources_source_id", "data_sources", ["source_id"], unique=True)

    # 4. ingestion_events table
    op.create_table(
        "ingestion_events",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer, "sqlite"), autoincrement=True, nullable=False),
        sa.Column("source_id", sa.Uuid(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("records_ingested", sa.Integer(), nullable=True),
        sa.Column("duration_ms", sa.Integer(), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("provenance", sa.String(length=32), nullable=False, server_default="HISTORICAL"),
        sa.Column("metadata", json_type, nullable=True),
        sa.ForeignKeyConstraint(["source_id"], ["data_sources.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_ingestion_source_started", "ingestion_events", ["source_id", sa.text("started_at DESC")], unique=False)
    op.create_index("ix_ingestion_status_started", "ingestion_events", ["status", sa.text("started_at DESC")], unique=False)

    # 5. sensors table
    op.create_table(
        "sensors",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("sensor_id", sa.String(length=64), nullable=False),
        sa.Column("zone_id", sa.Uuid(), nullable=True),
        sa.Column("source_id", sa.Uuid(), nullable=True),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("sensor_type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="CONNECTED"),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("geometry", point_geom_type, nullable=True),
        sa.Column("installed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("metadata", json_type, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["source_id"], ["data_sources.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_sensors_sensor_id", "sensors", ["sensor_id"], unique=True)
    op.create_index("ix_sensors_zone_id", "sensors", ["zone_id"], unique=False)
    op.create_index("ix_sensors_source_id", "sensors", ["source_id"], unique=False)

    # 6. telemetry_readings table
    op.create_table(
        "telemetry_readings",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer, "sqlite"), autoincrement=True, nullable=False),
        sa.Column("sensor_id", sa.Uuid(), nullable=True),
        sa.Column("zone_id", sa.Uuid(), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("measurement_type", sa.String(length=64), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(length=32), nullable=False),
        sa.Column("provenance", sa.String(length=32), nullable=False, server_default="SIMULATED"),
        sa.Column("metadata", json_type, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["sensor_id"], ["sensors.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_telemetry_zone_timestamp", "telemetry_readings", ["zone_id", sa.text("timestamp DESC")], unique=False)
    op.create_index("ix_telemetry_sensor_timestamp", "telemetry_readings", ["sensor_id", sa.text("timestamp DESC")], unique=False)
    op.create_index("ix_telemetry_type_timestamp", "telemetry_readings", ["measurement_type", sa.text("timestamp DESC")], unique=False)
    op.create_index("ix_telemetry_provenance", "telemetry_readings", ["provenance"], unique=False)

    # 7. risk_evaluations table
    op.create_table(
        "risk_evaluations",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer, "sqlite"), autoincrement=True, nullable=False),
        sa.Column("zone_id", sa.Uuid(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("static_susceptibility", sa.Float(), nullable=True),
        sa.Column("terrain_factor", sa.Float(), nullable=True),
        sa.Column("rainfall_factor", sa.Float(), nullable=True),
        sa.Column("soil_factor", sa.Float(), nullable=True),
        sa.Column("historical_factor", sa.Float(), nullable=True),
        sa.Column("dynamic_risk_score", sa.Float(), nullable=False),
        sa.Column("severity", sa.String(length=32), nullable=False),
        sa.Column("provenance", sa.String(length=32), nullable=False, server_default="SIMULATED"),
        sa.Column("degraded_mode", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("degraded_reasons", json_type, nullable=True),
        sa.Column("model_version", sa.String(length=64), nullable=True),
        sa.Column("evidence", json_type, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("dynamic_risk_score >= 0.0 AND dynamic_risk_score <= 1.0", name="chk_dynamic_risk_bounds"),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_risk_zone_timestamp", "risk_evaluations", ["zone_id", sa.text("timestamp DESC")], unique=False)
    op.create_index("ix_risk_severity_timestamp", "risk_evaluations", ["severity", sa.text("timestamp DESC")], unique=False)
    op.create_index("ix_risk_provenance", "risk_evaluations", ["provenance"], unique=False)

    # 8. alerts table
    op.create_table(
        "alerts",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("alert_id", sa.String(length=64), nullable=False),
        sa.Column("zone_id", sa.Uuid(), nullable=False),
        sa.Column("risk_evaluation_id", sa.BigInteger().with_variant(sa.Integer, "sqlite"), nullable=True),
        sa.Column("severity", sa.String(length=32), nullable=False),
        sa.Column("risk_score", sa.Float(), nullable=False),
        sa.Column("trigger_reason", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="ACTIVE"),
        sa.Column("provenance", sa.String(length=32), nullable=False, server_default="SIMULATED"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("acknowledged_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["risk_evaluation_id"], ["risk_evaluations.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_alerts_alert_id", "alerts", ["alert_id"], unique=True)
    op.create_index("ix_alerts_zone_created", "alerts", ["zone_id", sa.text("created_at DESC")], unique=False)
    op.create_index("ix_alerts_status_severity", "alerts", ["status", "severity"], unique=False)
    op.create_index("ix_alerts_created_at_desc", "alerts", [sa.text("created_at DESC")], unique=False)

    # 9. alert_audit_history table
    op.create_table(
        "alert_audit_history",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer, "sqlite"), autoincrement=True, nullable=False),
        sa.Column("alert_id", sa.Uuid(), nullable=False),
        sa.Column("operator_id", sa.String(length=64), nullable=False),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["alert_id"], ["alerts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_alert_audit_alert_time", "alert_audit_history", ["alert_id", sa.text("timestamp DESC")], unique=False)


def downgrade() -> None:
    op.drop_table("alert_audit_history")
    op.drop_table("alerts")
    op.drop_table("risk_evaluations")
    op.drop_table("telemetry_readings")
    op.drop_table("sensors")
    op.drop_table("ingestion_events")
    op.drop_table("data_sources")
    op.drop_table("zone_terrain_features")
    op.drop_table("zones")
