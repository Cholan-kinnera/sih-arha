import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchJson,
  ApiError,
  getZones,
  getZoneDetail,
  getRiskMatrix,
  acknowledgeAlert,
  getHealthStatus,
} from '../api';

describe('Frontend API Client Layer', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('fetchJson successfully parses JSON response with 200 OK', async () => {
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ success: true, count: 42 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const res = await fetchJson<{ success: boolean; count: number }>('/test-endpoint');
    assert.equal(res.success, true);
    assert.equal(res.count, 42);
  });

  it('fetchJson throws ApiError on 404 Not Found', async () => {
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ detail: 'Zone not found' }), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
      });
    };

    await assert.rejects(
      async () => {
        await fetchJson('/api/v1/zones/invalid-id');
      },
      (err: unknown) => {
        assert(err instanceof ApiError);
        assert.equal(err.status, 404);
        assert.equal(err.detail, 'Zone not found');
        assert.equal(err.userFriendlyMessage, 'Zone not found');
        return true;
      }
    );
  });

  it('fetchJson throws ApiError on 500 Internal Server Error', async () => {
    globalThis.fetch = async () => {
      return new Response('Database timeout', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    };

    await assert.rejects(
      async () => {
        await fetchJson('/api/v1/risk/current');
      },
      (err: unknown) => {
        assert(err instanceof ApiError);
        assert.equal(err.status, 500);
        assert.equal(err.userFriendlyMessage, 'The backend encountered an internal error. Please try again shortly.');
        return true;
      }
    );
  });

  it('getZones correctly formats query params and parses ZoneListResponse', async () => {
    let capturedUrl = '';
    globalThis.fetch = async (input: RequestInfo | URL) => {
      capturedUrl = String(input);
      return new Response(
        JSON.stringify({
          total: 1,
          page: 1,
          page_size: 20,
          total_pages: 1,
          zones: [
            {
              zone_id: 'Z-NER-001',
              name: 'East Khasi Hills Zone',
              state: 'Meghalaya',
              district: 'East Khasi Hills',
              subdivision: 'Meghalaya Plateau',
              is_ner: true,
              latitude: 25.57,
              longitude: 91.89,
              historical_landslide_count: 5,
              historical_landslide_presence: 1,
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const res = await getZones({ state: 'Meghalaya', is_ner: true, page: 1, page_size: 20 });
    assert(capturedUrl.includes('state=Meghalaya'));
    assert(capturedUrl.includes('is_ner=true'));
    assert.equal(res.total, 1);
    assert.equal(res.zones[0].zone_id, 'Z-NER-001');
    assert.equal(res.zones[0].state, 'Meghalaya');
  });

  it('getZoneDetail fetches detailed profile by zone_id', async () => {
    let capturedUrl = '';
    globalThis.fetch = async (input: RequestInfo | URL) => {
      capturedUrl = String(input);
      return new Response(
        JSON.stringify({
          zone_id: 'Z-NER-002',
          name: 'Aizawl Slope A',
          state: 'Mizoram',
          district: 'Aizawl',
          subdivision: 'Mizo Hills',
          is_ner: true,
          terrain: {
            terrain_coverage: true,
            terrain_status: 'TERRAIN_AVAILABLE',
            mean_elevation_m: 1132.5,
            mean_slope_deg: 32.4,
            mean_tri: 14.8,
            provenance: 'REAL-WORLD',
          },
          static_susceptibility_prior: 0.65,
          current_dynamic_risk: 0.78,
          current_severity: 'HIGH',
          data_freshness: 'LIVE',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const res = await getZoneDetail('Z-NER-002');
    assert(capturedUrl.includes('/api/v1/zones/Z-NER-002'));
    assert.equal(res.zone_id, 'Z-NER-002');
    assert.equal(res.terrain?.terrain_coverage, true);
    assert.equal(res.terrain?.mean_slope_deg, 32.4);
    assert.equal(res.current_severity, 'HIGH');
  });

  it('getRiskMatrix parses dynamic risk evaluation matrix', async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          timestamp_utc: '2026-08-28T12:00:00Z',
          total_zones: 2,
          severity_distribution: { LOW: 1, HIGH: 1 },
          evaluations: [
            {
              zone_id: 'Z-001',
              state: 'Assam',
              district: 'Dima Hasao',
              dynamic_risk_score: 0.74,
              severity_level: 'HIGH',
              degraded_mode: false,
              degraded_reasons: [],
              contributing_factors: {
                static_susceptibility: 0.60,
                rainfall_factor: 0.85,
                historical_context: 0.50,
              },
              factor_weights_used: { rainfall: 0.35 },
              data_freshness: { rainfall: 'LIVE' },
              timestamp_utc: '2026-08-28T12:00:00Z',
              model_version: 'LEWS-DYN-V1',
              provenance: 'LIVE',
              scientific_disclaimer: 'Operational warning indicator.',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const matrix = await getRiskMatrix();
    assert.equal(matrix.total_zones, 2);
    assert.equal(matrix.evaluations[0].dynamic_risk_score, 0.74);
    assert.equal(matrix.evaluations[0].severity_level, 'HIGH');
    assert.equal(matrix.evaluations[0].provenance, 'LIVE');
  });

  it('acknowledgeAlert sends real POST request and updates audit trail', async () => {
    let capturedMethod = '';
    let capturedBody = '';

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedMethod = init?.method || 'GET';
      capturedBody = String(init?.body || '');
      return new Response(
        JSON.stringify({
          alert_id: 'ALT-101',
          zone_id: 'Z-001',
          severity: 'CRITICAL',
          risk_score: 0.88,
          status: 'ACKNOWLEDGED',
          trigger_reason: 'Continuous high intensity rainfall threshold crossed',
          provenance: 'LIVE',
          created_at: '2026-08-28T10:00:00Z',
          acknowledged_at: '2026-08-28T10:05:00Z',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const res = await acknowledgeAlert('ALT-101', {
      operator_id: 'OP-412',
      notes: 'Road patrol dispatched to sector.',
    });

    assert.equal(capturedMethod, 'POST');
    assert(capturedBody.includes('OP-412'));
    assert(capturedBody.includes('Road patrol dispatched'));
    assert.equal(res.status, 'ACKNOWLEDGED');
    assert.equal(res.acknowledged_at, '2026-08-28T10:05:00Z');
  });

  it('getHealthStatus verifies backend and database connectivity', async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          database: 'connected',
          environment: 'production',
          version: '0.1.0',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const health = await getHealthStatus();
    assert.equal(health.status, 'healthy');
    assert.equal(health.database, 'connected');
  });
});
