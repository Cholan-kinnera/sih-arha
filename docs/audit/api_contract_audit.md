# LEWS Frontend ↔ Backend Contract Alignment Audit

**Subsystem**: Data Transfer Objects (DTOs), Schema Parity & Enum Consistency
**Auditor**: Antigravity Automated Verification Agent
**Date**: 2026-08-28
**Status**: PASS

---

## 1. Schema Parity Comparison

A comprehensive field-by-field audit was conducted between FastAPI Pydantic models in `apps/api/app/schemas/` and TypeScript interfaces in `apps/web/src/lib/api/types.ts`:

| Domain Concept | FastAPI Pydantic Schema | TypeScript Interface | Parity Status |
| :--- | :--- | :--- | :--- |
| **Zone Basic** | `ZoneResponse` (`zone_id`, `name`, `state`, `district`, `subdivision`, `is_ner`, `latitude`, `longitude`, `historical_landslide_count`, `historical_landslide_presence`) | `ZoneResponse` | **100% Match** |
| **Zone Detail** | `ZoneDetailResponse` (`terrain`, `static_susceptibility_prior`, `current_dynamic_risk`, `current_severity`, `data_freshness`) | `ZoneDetailResponse` | **100% Match** |
| **Terrain** | `TerrainSummary` (`terrain_coverage`, `terrain_status`, `mean_elevation_m`, `mean_slope_deg`, `mean_tri`, `provenance`) | `TerrainSummary` | **100% Match** |
| **Risk Evaluation** | `RiskEvaluationResponse` (`zone_id`, `state`, `district`, `dynamic_risk_score`, `severity_level`, `degraded_mode`, `degraded_reasons`, `contributing_factors`, `factor_weights_used`, `data_freshness`, `timestamp_utc`, `model_version`, `provenance`, `scientific_disclaimer`) | `RiskEvaluationResponse` | **100% Match** |
| **Risk Matrix** | `RiskMatrixResponse` (`timestamp_utc`, `total_zones`, `severity_distribution`, `evaluations`) | `RiskMatrixResponse` | **100% Match** |
| **Alert** | `AlertResponse` (`alert_id`, `zone_id`, `severity`, `risk_score`, `status`, `trigger_reason`, `provenance`, `created_at`, `acknowledged_at`, `resolved_at`) | `AlertResponse` | **100% Match** |
| **Alert Acknowledge** | `AlertAcknowledgeRequest` (`operator_id`, `notes`) | `AlertAcknowledgeRequest` | **100% Match** |
| **Alert Audit** | `AlertAuditResponse` (`alert_id`, `action`, `operator_id`, `notes`, `timestamp_utc`) | `AlertAuditResponse` | **100% Match** |
| **Data Source** | `DataSourceResponse` (`source_id`, `name`, `provider`, `category`, `status`, `freshness`, `provenance`, `cadence`, `last_ingested_at`, `record_count`, `metadata_json`) | `DataSourceResponse` | **100% Match** |
| **Telemetry Ingest** | `TelemetryIngestRequest`, `TelemetryIngestResponse` | `TelemetryIngestRequest`, `TelemetryIngestResponse` | **100% Match** |
| **WebSocket Stream** | `WebSocketTelemetryMessage` (`type`, `timestamp_utc`, `zone_id`, `sensor_id`, `measurement_type`, `value`, `unit`, `provenance`, `dynamic_risk_score`, `severity_level`, `alert_triggered`) | `WebSocketTelemetryMessage` | **100% Match** |
| **Health** | `HealthResponse` (`status`, `database`, `environment`, `version`) | `HealthResponse` | **100% Match** |

---

## 2. Enums & Value Bands Alignment

| Enum / Domain Metric | Backend Allowed Values | Frontend Allowed Values | Status |
| :--- | :--- | :--- | :--- |
| `SeverityLevel` | `LOW`, `MODERATE`, `HIGH`, `CRITICAL` | `LOW`, `MODERATE`, `HIGH`, `CRITICAL` | Match |
| `Provenance` | `LIVE`, `SIMULATED`, `HISTORICAL`, `CLIMATOLOGICAL`, `EXPERIMENTAL` | `LIVE`, `SIMULATED`, `HISTORICAL`, `CLIMATOLOGICAL`, `EXPERIMENTAL` | Match |
| `AlertStatus` | `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED` | `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED` | Match |
| `SourceStatus` | `CONNECTED`, `DEGRADED`, `STALE`, `OFFLINE` | `CONNECTED`, `DEGRADED`, `STALE`, `OFFLINE` | Match |
