import { useState, useMemo, useCallback, useEffect } from 'react';
import type {
  DataSourceItem,
  DataSourceFilterState,
  SourceStatus,
  SourceCategory,
  DataHealthSummaryMetrics,
} from '../types/data-sources.types';
import type { DataSourceType } from '../../../types/domain.types';
import {
  getDataSources,
  getDataSourceDetail,
  ApiError,
} from '../../../lib/api';
import {
  DATA_SOURCES_DEMO_DATA,
  DATA_HEALTH_METRICS,
  RECENT_INGESTION_EVENTS,
} from '../data/data-sources.demo';

const INITIAL_FILTERS: DataSourceFilterState = {
  searchQuery: '',
  selectedStatus: 'ALL',
  selectedCategory: 'ALL',
  selectedProvenance: 'ALL',
};

export const useDataSources = () => {
  const [sources, setSources] = useState<DataSourceItem[]>([]);
  const [filters, setFilters] = useState<DataSourceFilterState>(INITIAL_FILTERS);
  const [selectedSource, setSelectedSource] = useState<DataSourceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadSourcesData = async () => {
      try {
        const res = await getDataSources();
        if (!isMounted) return;

        const mapped: DataSourceItem[] = res.sources.map((s) => ({
          id: s.source_id,
          name: s.name,
          provider: s.provider,
          category: (s.category as SourceCategory) || 'Meteorological Telemetry',
          dataDomain: s.category || 'Environmental Telemetry',
          description: `${s.name} provided by ${s.provider}. Cadence: ${s.cadence || 'Automated'}.`,
          status: (s.status as SourceStatus) || 'CONNECTED',
          freshness: (s.freshness as any) || 'FRESH',
          provenance: (s.provenance as DataSourceType) || 'REAL-WORLD',
          expectedInterval: s.cadence || '1 Hour',
          lastUpdated: s.last_ingested_at || new Date().toISOString(),
          lastUpdatedRelative: 'Just now',
          recordCount: s.record_count,
          spatialCoverage: 'North-Eastern Region (NER) & All-India Baseline',
          spatialResolution: 'District & Catchment Basin Level',
          coordinateSystem: 'EPSG:4326 (WGS84)',
          endpointType: 'REST API / Telemetry Stream',
          limitations: 'Operational data depends on network connectivity and sensor uplink health.',
          schemaFields: ['zone_id (VARCHAR)', 'timestamp (TIMESTAMPTZ)', 'value (DOUBLE)'],
          recentEvents: [],
        }));

        setSources(mapped);
        setError(null);
        setIsBackendUnavailable(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn('[useDataSources] API fetch error:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to fetch data sources from backend.';
        setError(msg);
        setIsBackendUnavailable(true);
        setSources(DATA_SOURCES_DEMO_DATA);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSourcesData();

    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setIsBackendUnavailable(false);
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  const selectSource = useCallback(async (source: DataSourceItem | null) => {
    if (!source) {
      setSelectedSource(null);
      return;
    }

    setSelectedSource(source);

    // Fetch rich source detail
    try {
      const detail = await getDataSourceDetail(source.id);
      if (detail) {
        setSelectedSource((prev) => {
          if (!prev || prev.id !== source.id) return prev;
          return {
            ...prev,
            recordCount: detail.record_count,
            lastUpdated: detail.last_ingested_at || prev.lastUpdated,
          };
        });
      }
    } catch (err) {
      console.warn('[useDataSources] Failed to load source detail:', err);
    }
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedStatus = useCallback((status: SourceStatus | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedStatus: status }));
  }, []);

  const setSelectedCategory = useCallback((category: SourceCategory | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setSelectedProvenance = useCallback((provenance: DataSourceType | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedProvenance: provenance }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const allSources = sources.length > 0 ? sources : DATA_SOURCES_DEMO_DATA;

  // Filter sources
  const filteredSources = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    return allSources.filter((src) => {
      if (q) {
        const matchesName = src.name.toLowerCase().includes(q);
        const matchesProvider = src.provider.toLowerCase().includes(q);
        const matchesDomain = (src.dataDomain ?? '').toLowerCase().includes(q);
        const matchesId = src.id.toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesDomain && !matchesId) {
          return false;
        }
      }

      if (filters.selectedStatus !== 'ALL') {
        if (src.status !== filters.selectedStatus) return false;
      }

      if (filters.selectedCategory !== 'ALL') {
        if (src.category !== filters.selectedCategory) return false;
      }

      if (filters.selectedProvenance !== 'ALL') {
        if (src.provenance !== filters.selectedProvenance) return false;
      }

      return true;
    });
  }, [allSources, filters]);

  // Real-time summary metrics calculation
  const metrics: DataHealthSummaryMetrics = useMemo(() => {
    if (sources.length === 0) return DATA_HEALTH_METRICS;

    const totalSourcesCount = sources.length;
    const healthySourcesCount = sources.filter((s) => s.status === 'CONNECTED').length;
    const staleSourcesCount = sources.filter((s) => s.status === 'STALE' || s.status === 'DEGRADED').length;
    const offlineSourcesCount = sources.filter((s) => s.status === 'OFFLINE').length;
    const totalRecordsCount = sources.reduce((acc, s) => acc + s.recordCount, 0);

    return {
      totalSourcesCount,
      healthySourcesCount,
      staleSourcesCount,
      offlineSourcesCount,
      totalRecordsCount,
      lastSyncTimestamp: new Date().toISOString(),
      provenance: 'REAL-WORLD',
    };
  }, [sources]);

  return {
    sources: allSources,
    filteredSources,
    selectedSource,
    recentEvents: RECENT_INGESTION_EVENTS,
    filters,
    metrics,
    totalCount: allSources.length,
    visibleCount: filteredSources.length,
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
    selectSource,
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    setSelectedProvenance,
    resetFilters,
  };
};
