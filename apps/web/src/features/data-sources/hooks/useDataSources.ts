import { useState, useMemo, useCallback } from 'react';
import type {
  DataSourceItem,
  DataSourceFilterState,
  SourceStatus,
  SourceCategory,
} from '../types/data-sources.types';
import type { DataSourceType } from '../../../types/domain.types';
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
  const [sources] = useState<DataSourceItem[]>(DATA_SOURCES_DEMO_DATA);
  const [filters, setFilters] = useState<DataSourceFilterState>(INITIAL_FILTERS);
  const [selectedSource, setSelectedSource] = useState<DataSourceItem | null>(null);

  const selectSource = useCallback((source: DataSourceItem | null) => {
    setSelectedSource(source);
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

  // Filter sources
  const filteredSources = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    return sources.filter((src) => {
      // Search filter
      if (q) {
        const matchesName = src.name.toLowerCase().includes(q);
        const matchesProvider = src.provider.toLowerCase().includes(q);
        const matchesDomain = src.dataDomain.toLowerCase().includes(q);
        const matchesId = src.id.toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesDomain && !matchesId) {
          return false;
        }
      }

      // Status filter
      if (filters.selectedStatus !== 'ALL') {
        if (src.status !== filters.selectedStatus) return false;
      }

      // Category filter
      if (filters.selectedCategory !== 'ALL') {
        if (src.category !== filters.selectedCategory) return false;
      }

      // Provenance filter
      if (filters.selectedProvenance !== 'ALL') {
        if (src.provenance !== filters.selectedProvenance) return false;
      }

      return true;
    });
  }, [sources, filters]);

  return {
    sources,
    filteredSources,
    selectedSource,
    recentEvents: RECENT_INGESTION_EVENTS,
    filters,
    metrics: DATA_HEALTH_METRICS,
    totalCount: sources.length,
    visibleCount: filteredSources.length,
    selectSource,
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    setSelectedProvenance,
    resetFilters,
  };
};
