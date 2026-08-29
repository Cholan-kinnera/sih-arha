/**
 * Zone Management & Catchment Intelligence API Endpoints
 */

import { fetchJson } from './client';
import { API_V1_PREFIX } from './config';
import type {
  ZoneDetailResponse,
  ZoneListResponse,
  ZoneQueryParams,
} from './types';

export async function getZones(params: ZoneQueryParams = {}): Promise<ZoneListResponse> {
  return fetchJson<ZoneListResponse>(`${API_V1_PREFIX}/zones`, {
    method: 'GET',
    params: {
      search: params.search,
      state: params.state,
      district: params.district,
      is_ner: params.is_ner,
      page: params.page,
      page_size: params.page_size,
    },
  });
}

export async function getZoneDetail(zoneId: string): Promise<ZoneDetailResponse> {
  const cleanId = encodeURIComponent(zoneId.trim());
  return fetchJson<ZoneDetailResponse>(`${API_V1_PREFIX}/zones/${cleanId}`, {
    method: 'GET',
  });
}
