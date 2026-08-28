import { useState, useMemo, useCallback, useEffect } from 'react';
import type { SeverityLevel } from '../../../types/domain.types';
import type {
  ZoneDetailedProfile,
  ZoneFilterState,
  ZoneSortOption,
  ZonesSummaryMetrics,
} from '../types/zones.types';
import { getZones, getRiskMatrix, getZoneDetail, ApiError } from '../../../lib/api';
import { ZONES_DEMO_DATA, ZONES_METRICS_SUMMARY } from '../data/zones.demo';
import { useRealtimeStore } from '../../../stores/useRealtimeStore';

const INITIAL_FILTERS: ZoneFilterState = {
  searchQuery: '',
  selectedSeverity: 'ALL',
  selectedDistrict: 'ALL',
  minRiskScore: 0,
  minSlopeDegrees: 0,
  sortBy: 'RISK_DESC',
};

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
};

export const useZones = () => {
  const [filters, setFilters] = useState<ZoneFilterState>(INITIAL_FILTERS);
  const [selectedZone, setSelectedZone] = useState<ZoneDetailedProfile | null>(null);
  const [apiZones, setApiZones] = useState<ZoneDetailedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const liveZoneRisks = useRealtimeStore((s) => s.liveZoneRisks);

  useEffect(() => {
    let isMounted = true;

    const loadZonesData = async () => {
      try {
        const [zonesRes, riskRes] = await Promise.all([
          getZones({ page: 1, page_size: 100 }),
          getRiskMatrix().catch(() => null),
        ]);

        if (!isMounted) return;

        const riskMap = new Map<string, { score: number; severity: SeverityLevel; prov: string; rainFactor: number }>();
        if (riskRes?.evaluations) {
          riskRes.evaluations.forEach((ev) => {
            riskMap.set(ev.zone_id, {
              score: ev.dynamic_risk_score,
              severity: (ev.severity_level as SeverityLevel) || 'LOW',
              prov: ev.provenance,
              rainFactor: ev.contributing_factors.rainfall_factor,
            });
          });
        }

        const mappedZones: ZoneDetailedProfile[] = zonesRes.zones.map((z) => {
          const riskInfo = riskMap.get(z.zone_id);
          const liveRisk = liveZoneRisks[z.zone_id];

          const finalScore = liveRisk?.dynamic_risk_score ?? riskInfo?.score ?? 0.0;
          const finalSev = (liveRisk?.severity_level as SeverityLevel) ?? riskInfo?.severity ?? 'LOW';
          const finalProv = (liveRisk ? 'SIMULATED' : riskInfo?.prov || 'HISTORICAL') as any;

          return {
            id: z.zone_id,
            name: z.name,
            district: z.district,
            state: z.state,
            latitude: z.latitude || 26.0,
            longitude: z.longitude || 92.5,
            geometry: { type: 'Polygon', coordinates: [] },
            slope: 0,
            elevation: 0,
            soil_type: 'Colluvial Mountain Soil',
            current_risk_score: finalScore,
            current_severity: finalSev,
            provenance: finalProv,
            rain_24h_mm: Math.round((riskInfo?.rainFactor ?? 0.1) * 150),
            rain_72h_mm: Math.round((riskInfo?.rainFactor ?? 0.1) * 280),
            soil_moisture_pct: 60,
            drainage_basin: z.subdivision || 'North-East Basin',
            historical_incidents_count: z.historical_landslide_count || 0,
            last_updated: new Date().toISOString(),
          };
        });

        setApiZones(mappedZones);
        setError(null);
        setIsBackendUnavailable(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn('[useZones] API fetch error:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to fetch zones from backend.';
        setError(msg);
        setIsBackendUnavailable(true);
        // Explicit fallback for developer/demo mode only
        setApiZones(ZONES_DEMO_DATA);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadZonesData();

    return () => {
      isMounted = false;
    };
  }, [liveZoneRisks, refetchTrigger]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setIsBackendUnavailable(false);
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  const allZones = apiZones.length > 0 ? apiZones : ZONES_DEMO_DATA;

  const selectZone = useCallback(async (zone: ZoneDetailedProfile | null) => {
    if (!zone) {
      setSelectedZone(null);
      return;
    }

    setSelectedZone(zone);

    // Fetch rich backend detail
    try {
      const detail = await getZoneDetail(zone.id);
      if (detail) {
        setSelectedZone((prev) => {
          if (!prev || prev.id !== zone.id) return prev;
          return {
            ...prev,
            current_risk_score: detail.current_dynamic_risk ?? prev.current_risk_score,
            current_severity: (detail.current_severity as SeverityLevel) ?? prev.current_severity,
            slope: detail.terrain?.mean_slope_deg ?? prev.slope,
            elevation: detail.terrain?.mean_elevation_m ?? prev.elevation,
            last_updated: new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[useZones] Failed to load zone detail:', err);
    }
  }, []);

  const selectZoneById = useCallback(
    (zoneId: string) => {
      const found = allZones.find((z) => z.id === zoneId);
      if (found) {
        selectZone(found);
      }
    },
    [allZones, selectZone]
  );

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedSeverity = useCallback((severity: SeverityLevel | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedSeverity: severity }));
  }, []);

  const setMinRiskScore = useCallback((score: number) => {
    setFilters((prev) => ({ ...prev, minRiskScore: score }));
  }, []);

  const setMinSlopeDegrees = useCallback((slope: number) => {
    setFilters((prev) => ({ ...prev, minSlopeDegrees: slope }));
  }, []);

  const setSortBy = useCallback((sort: ZoneSortOption) => {
    setFilters((prev) => ({ ...prev, sortBy: sort }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Filter and sort the zones deterministically
  const filteredAndSortedZones = useMemo(() => {
    const filtered = allZones.filter((zone) => {
      // Search filter
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = zone.name.toLowerCase().includes(q);
        const matchesId = zone.id.toLowerCase().includes(q);
        const matchesDistrict = (zone.district ?? '').toLowerCase().includes(q);
        const matchesSoil = (zone.soil_type ?? '').toLowerCase().includes(q);
        const matchesBasin = (zone.drainage_basin ?? '').toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDistrict && !matchesSoil && !matchesBasin) {
          return false;
        }
      }

      // Severity filter
      if (filters.selectedSeverity !== 'ALL') {
        if (zone.current_severity !== filters.selectedSeverity) {
          return false;
        }
      }

      // Min risk score filter
      if ((zone.current_risk_score ?? 0) < filters.minRiskScore) {
        return false;
      }

      // Min slope filter
      if (zone.slope < filters.minSlopeDegrees) {
        return false;
      }

      return true;
    });

    // Deterministic sorting
    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'RISK_ASC':
          return (a.current_risk_score ?? 0) - (b.current_risk_score ?? 0);
        case 'SLOPE_DESC':
          return b.slope - a.slope;
        case 'RAIN_24H_DESC':
          return b.rain_24h_mm - a.rain_24h_mm;
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        case 'RISK_DESC':
        default: {
          const sevA = SEVERITY_ORDER[a.current_severity ?? 'LOW'];
          const sevB = SEVERITY_ORDER[b.current_severity ?? 'LOW'];
          if (sevB !== sevA) return sevB - sevA;
          return (b.current_risk_score ?? 0) - (a.current_risk_score ?? 0);
        }
      }
    });
  }, [allZones, filters]);

  // Top priority zones
  const priorityZones = useMemo(() => {
    return [...allZones]
      .sort((a, b) => {
        const sevA = SEVERITY_ORDER[a.current_severity ?? 'LOW'];
        const sevB = SEVERITY_ORDER[b.current_severity ?? 'LOW'];
        if (sevB !== sevA) return sevB - sevA;
        return (b.current_risk_score ?? 0) - (a.current_risk_score ?? 0);
      })
      .slice(0, 3);
  }, [allZones]);

  // Real computed summary metrics
  const metrics: ZonesSummaryMetrics = useMemo(() => {
    if (apiZones.length === 0) return ZONES_METRICS_SUMMARY;

    const criticalCount = apiZones.filter((z) => z.current_severity === 'CRITICAL').length;
    const highCount = apiZones.filter((z) => z.current_severity === 'HIGH').length;
    const moderateCount = apiZones.filter((z) => z.current_severity === 'MODERATE').length;
    const lowCount = apiZones.filter((z) => z.current_severity === 'LOW').length;

    const totalScore = apiZones.reduce((acc, z) => acc + (z.current_risk_score ?? 0), 0);
    const avgScore = apiZones.length > 0 ? totalScore / apiZones.length : 0;

    let maxRain = 0;
    let maxRainName = 'None';
    apiZones.forEach((z) => {
      if (z.rain_24h_mm > maxRain) {
        maxRain = z.rain_24h_mm;
        maxRainName = z.name;
      }
    });

    return {
      totalZonesCount: apiZones.length,
      criticalCount,
      highCount,
      moderateCount,
      lowCount,
      avgRegionalRiskScore: Number(avgScore.toFixed(3)),
      max24hRainfallMm: maxRain,
      max24hRainfallZoneName: maxRainName,
    };
  }, [apiZones]);

  return {
    filters,
    selectedZone,
    allZones,
    filteredZones: filteredAndSortedZones,
    priorityZones,
    metrics,
    totalCount: allZones.length,
    visibleCount: filteredAndSortedZones.length,
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
    selectZone,
    selectZoneById,
    setSearchQuery,
    setSelectedSeverity,
    setMinRiskScore,
    setMinSlopeDegrees,
    setSortBy,
    resetFilters,
  };
};
