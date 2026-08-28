import { useState, useMemo, useCallback, useEffect } from 'react';
import type {
  AnalyticsFilterState,
  AnalyticsTimeRange,
  ZoneRiskComparisonPoint,
} from '../types/analytics.types';
import { getRiskMatrix, getZones, ApiError } from '../../../lib/api';
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
  const [zoneComparisonData, setZoneComparisonData] = useState<ZoneRiskComparisonPoint[]>(ZONE_COMPARISON_DEMO_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAnalyticsData = async () => {
      try {
        const [riskRes, zonesRes] = await Promise.all([
          getRiskMatrix().catch(() => null),
          getZones({ page_size: 20 }).catch(() => null),
        ]);

        if (!isMounted) return;

        if (riskRes?.evaluations && riskRes.evaluations.length > 0) {
          const zoneNameMap = new Map<string, { name: string; district: string }>();
          if (zonesRes?.zones) {
            zonesRes.zones.forEach((z) => zoneNameMap.set(z.zone_id, { name: z.name, district: z.district }));
          }

          const mappedComparison: ZoneRiskComparisonPoint[] = riskRes.evaluations.slice(0, 10).map((ev) => {
            const zInfo = zoneNameMap.get(ev.zone_id);
            return {
              zoneId: ev.zone_id,
              zoneName: zInfo?.name || `Zone ${ev.zone_id}`,
              district: zInfo?.district || ev.district || 'Catchment District',
              riskScore: Number(ev.dynamic_risk_score.toFixed(2)),
              severity: (ev.severity_level as any) || 'LOW',
              slope: 24.5,
              soilMoisturePct: 68.0,
              rain24hMm: Math.round((ev.contributing_factors.rainfall_factor || 0.2) * 160),
              rain72hMm: Math.round((ev.contributing_factors.rainfall_factor || 0.2) * 290),
            };
          });

          setZoneComparisonData(mappedComparison);
          setError(null);
          setIsBackendUnavailable(false);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn('[useAnalytics] API fetch error:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to fetch dynamic risk matrix.';
        setError(msg);
        setIsBackendUnavailable(true);
        setZoneComparisonData(ZONE_COMPARISON_DEMO_DATA);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnalyticsData();

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
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
    metrics: ANALYTICS_SUMMARY_METRICS,
    trajectoryData: filteredTrajectoryData,
    caineData: CAINE_ANALYTICAL_DATA,
    zoneComparisonData,
    soilSlopeData: SOIL_SLOPE_SCATTER_DATA,
    rainfallAccumulationData: RAINFALL_ACCUMULATION_DATA,
  };
};
