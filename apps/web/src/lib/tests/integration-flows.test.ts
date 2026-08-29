import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  getZones,
  getZoneDetail,
  getRiskMatrix,
  getAlerts,
  acknowledgeAlert,
  getAlertAuditTrail,
  getDataSources,
} from '../api';
import { useRealtimeStore } from '../../stores/useRealtimeStore';

describe('LEWS End-to-End Vertical Slice Integration Flows', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('FLOW 1: Zones API → Zone Detail Drawer', async () => {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/v1/zones/Z-001')) {
        return new Response(
          JSON.stringify({
            zone_id: 'Z-001',
            name: 'Wayanad Catchment Sector 1',
            state: 'Kerala',
            district: 'Wayanad',
            subdivision: 'Western Ghats',
            is_ner: false,
            terrain: {
              terrain_coverage: true,
              terrain_status: 'TERRAIN_AVAILABLE',
              mean_elevation_m: 850.0,
              mean_slope_deg: 29.5,
              mean_tri: 12.0,
              provenance: 'REAL-WORLD',
            },
            static_susceptibility_prior: 0.65,
            current_dynamic_risk: 0.82,
            current_severity: 'CRITICAL',
            data_freshness: 'LIVE',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          total: 1,
          page: 1,
          page_size: 20,
          total_pages: 1,
          zones: [
            {
              zone_id: 'Z-001',
              name: 'Wayanad Catchment Sector 1',
              state: 'Kerala',
              district: 'Wayanad',
              subdivision: 'Western Ghats',
              is_ner: false,
              historical_landslide_count: 3,
              historical_landslide_presence: 1,
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const zonesList = await getZones();
    assert.equal(zonesList.zones.length, 1);
    assert.equal(zonesList.zones[0].zone_id, 'Z-001');

    const detail = await getZoneDetail('Z-001');
    assert.equal(detail.zone_id, 'Z-001');
    assert.equal(detail.terrain?.mean_slope_deg, 29.5);
    assert.equal(detail.current_severity, 'CRITICAL');
  });

  it('FLOW 2: Risk Matrix API → Overview Metrics & Severity Distribution', async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          timestamp_utc: '2026-08-28T12:00:00Z',
          total_zones: 3,
          severity_distribution: { CRITICAL: 1, HIGH: 1, LOW: 1 },
          evaluations: [
            {
              zone_id: 'Z-001',
              state: 'Kerala',
              district: 'Wayanad',
              dynamic_risk_score: 0.85,
              severity_level: 'CRITICAL',
              degraded_mode: false,
              degraded_reasons: [],
              contributing_factors: {
                static_susceptibility: 0.65,
                rainfall_factor: 0.90,
                historical_context: 0.70,
              },
              factor_weights_used: {},
              data_freshness: {},
              timestamp_utc: '2026-08-28T12:00:00Z',
              model_version: 'V1',
              provenance: 'LIVE',
              scientific_disclaimer: 'Operational warning.',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const matrix = await getRiskMatrix();
    assert.equal(matrix.total_zones, 3);
    assert.equal(matrix.severity_distribution.CRITICAL, 1);
    assert.equal(matrix.evaluations[0].dynamic_risk_score, 0.85);
  });

  it('FLOW 3: Alerts API → Acknowledge → Audit Trail Invalidation', async () => {
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/acknowledge') && init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            alert_id: 'ALT-202',
            zone_id: 'Z-001',
            severity: 'CRITICAL',
            risk_score: 0.91,
            status: 'ACKNOWLEDGED',
            trigger_reason: 'Intense precipitation',
            provenance: 'LIVE',
            created_at: '2026-08-28T12:00:00Z',
            acknowledged_at: '2026-08-28T12:05:00Z',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (url.includes('/audit')) {
        return new Response(
          JSON.stringify([
            {
              alert_id: 'ALT-202',
              action: 'ACKNOWLEDGED',
              operator_id: 'OP-412',
              notes: 'Civil defense notified.',
              timestamp_utc: '2026-08-28T12:05:00Z',
            },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          total: 1,
          page: 1,
          page_size: 10,
          total_pages: 1,
          alerts: [
            {
              alert_id: 'ALT-202',
              zone_id: 'Z-001',
              severity: 'CRITICAL',
              risk_score: 0.91,
              status: 'ACTIVE',
              trigger_reason: 'Intense precipitation',
              provenance: 'LIVE',
              created_at: '2026-08-28T12:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    // Step 1: List alerts
    const alerts = await getAlerts();
    assert.equal(alerts.alerts[0].status, 'ACTIVE');

    // Step 2: Acknowledge alert
    const ackRes = await acknowledgeAlert('ALT-202', {
      operator_id: 'OP-412',
      notes: 'Civil defense notified.',
    });
    assert.equal(ackRes.status, 'ACKNOWLEDGED');

    // Step 3: Fetch audit trail
    const audits = await getAlertAuditTrail('ALT-202');
    assert.equal(audits.length, 1);
    assert.equal(audits[0].operator_id, 'OP-412');
    assert.equal(audits[0].action, 'ACKNOWLEDGED');
  });

  it('FLOW 4: WebSocket Telemetry Ingestion → Live Zustand Store Update', () => {
    const store = useRealtimeStore.getState();

    store.handleLiveTelemetryMessage({
      type: 'TELEMETRY_UPDATE',
      timestamp_utc: '2026-08-28T12:30:00Z',
      zone_id: 'Z-999',
      sensor_id: 'AWS-01',
      measurement_type: 'rainfall_rate_mm_h',
      value: 65.4,
      unit: 'mm/h',
      provenance: 'LIVE',
      dynamic_risk_score: 0.88,
      severity_level: 'CRITICAL',
      alert_triggered: true,
    });

    const updated = useRealtimeStore.getState();
    assert.equal(updated.lastTelemetryTimestamp, '2026-08-28T12:30:00Z');
    assert.equal(updated.liveZoneRisks['Z-999']?.dynamic_risk_score, 0.88);
    assert.equal(updated.liveZoneRisks['Z-999']?.severity_level, 'CRITICAL');
  });

  it('FLOW 5: Data Sources Registry Query', async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          total: 1,
          sources: [
            {
              source_id: 'SRC-IMD',
              name: 'IMD AWS Telemetry',
              provider: 'India Meteorological Department',
              category: 'METEOROLOGICAL',
              status: 'CONNECTED',
              freshness: 'FRESH',
              provenance: 'REAL-WORLD',
              cadence: 'Hourly',
              last_ingested_at: '2026-08-28T12:00:00Z',
              record_count: 14500,
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const sourcesRes = await getDataSources();
    assert.equal(sourcesRes.total, 1);
    assert.equal(sourcesRes.sources[0].source_id, 'SRC-IMD');
    assert.equal(sourcesRes.sources[0].status, 'CONNECTED');
  });
});
