import type { DataSourceType } from '../../../types/domain.types';

export type SourceStatus = 'CONNECTED' | 'DEGRADED' | 'STALE' | 'OFFLINE' | 'NOT_CONFIGURED';

export type SourceFreshness = 'FRESH' | 'AGING' | 'STALE' | 'OFFLINE';

export type SourceCategory =
  | 'Meteorological Telemetry'
  | 'Geotechnical Probes'
  | 'Terrain & Elevation'
  | 'Historical Inventory'
  | 'Spatial Catchment Mesh';

export interface IngestionEvent {
  id: string;
  timestamp: string;
  sourceId: string;
  sourceName: string;
  operation: string;
  recordsProcessed: number;
  durationMs: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  details: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  provider: string;
  category: SourceCategory;
  dataDomain: string;
  status: SourceStatus;
  freshness: SourceFreshness;
  expectedInterval: string;
  lastUpdated: string;
  lastUpdatedRelative: string;
  provenance: DataSourceType;
  recordCount: number;
  spatialCoverage: string;
  coordinateSystem: string;
  spatialResolution: string;
  schemaFields: string[];
  endpointType: string;
  limitations: string;
  recentEvents: IngestionEvent[];
}

export interface DataHealthSummaryMetrics {
  totalSourcesCount: number;
  healthySourcesCount: number;
  staleSourcesCount: number;
  offlineSourcesCount: number;
  totalRecordsCount: number;
  lastSyncTimestamp: string;
  provenance: DataSourceType;
}

export interface DataSourceFilterState {
  searchQuery: string;
  selectedStatus: SourceStatus | 'ALL';
  selectedCategory: SourceCategory | 'ALL';
  selectedProvenance: DataSourceType | 'ALL';
}
