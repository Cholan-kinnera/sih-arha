import { useState, useMemo, useCallback } from 'react';
import type {
  AnalyticsFilterState,
  AnalyticsTimeRange,
} from '../types/analytics.types';
import {
  TRAJECTORY_DEMO_DATA,
  CAINE_ANALYTICAL_DATA,
  ZONE_COMPARISON_DEMO_DATA,
  SOIL_SLOPE_SCATTER_DATA,
  RAINFALL_ACCUMULATION_DATA,
  ANALYTICS_SUMMARY_METRICS,
} from '../data/analytics.demo';

const INITIAL_FILTERS: AnalyticsFilterState = {
  timeRange: '72H',
  selectedBasin: 'ALL',
};

export const useAnalytics = () => {
  const [filters, setFilters] = useState<AnalyticsFilterState>(INITIAL_FILTERS);

  const setTimeRange = useCallback((timeRange: AnalyticsTimeRange) => {
    setFilters((prev) => ({ ...prev, timeRange }));
  }, []);

  const setSelectedBasin = useCallback((basin: string | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedBasin: basin }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Filter trajectory by selected time range
  const filteredTrajectoryData = useMemo(() => {
    if (filters.timeRange === '24H') {
      return TRAJECTORY_DEMO_DATA.slice(-4);
    }
    if (filters.timeRange === '48H') {
      return TRAJECTORY_DEMO_DATA.slice(-6);
    }
    return TRAJECTORY_DEMO_DATA;
  }, [filters.timeRange]);

  return {
    filters,
    setTimeRange,
    setSelectedBasin,
    resetFilters,
    metrics: ANALYTICS_SUMMARY_METRICS,
    trajectoryData: filteredTrajectoryData,
    caineData: CAINE_ANALYTICAL_DATA,
    zoneComparisonData: ZONE_COMPARISON_DEMO_DATA,
    soilSlopeData: SOIL_SLOPE_SCATTER_DATA,
    rainfallAccumulationData: RAINFALL_ACCUMULATION_DATA,
  };
};
