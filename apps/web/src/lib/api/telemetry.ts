/**
 * Observational Telemetry Ingestion API Endpoints
 */

import { fetchJson } from './client';
import { API_V1_PREFIX } from './config';
import type {
  TelemetryIngestRequest,
  TelemetryIngestResponse,
} from './types';

export async function ingestTelemetry(
  payload: TelemetryIngestRequest
): Promise<TelemetryIngestResponse> {
  return fetchJson<TelemetryIngestResponse>(`${API_V1_PREFIX}/telemetry`, {
    method: 'POST',
    body: payload,
  });
}
