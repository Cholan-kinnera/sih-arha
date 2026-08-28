import { useState, useMemo, useCallback } from 'react';
import type { SeverityLevel } from '../../../types/domain.types';
import type {
  ZoneDetailedProfile,
  ZoneFilterState,
  ZoneSortOption,
} from '../types/zones.types';
import { ZONES_DEMO_DATA, ZONES_METRICS_SUMMARY } from '../data/zones.demo';

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

  const allZones = ZONES_DEMO_DATA;
  const metrics = ZONES_METRICS_SUMMARY;

  const selectZone = useCallback((zone: ZoneDetailedProfile | null) => {
    setSelectedZone(zone);
  }, []);

  const selectZoneById = useCallback(
    (zoneId: string) => {
      const found = allZones.find((z) => z.id === zoneId);
      if (found) {
        setSelectedZone(found);
      }
    },
    [allZones]
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
        const matchesSoil = zone.soil_type.toLowerCase().includes(q);
        const matchesBasin = zone.drainage_basin.toLowerCase().includes(q);
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

  // Top priority zones (Deterministic: highest vulnerability sectors)
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

  return {
    filters,
    selectedZone,
    allZones,
    filteredZones: filteredAndSortedZones,
    priorityZones,
    metrics,
    totalCount: allZones.length,
    visibleCount: filteredAndSortedZones.length,
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
