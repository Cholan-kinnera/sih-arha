import { useState, useMemo, useCallback } from 'react';
import type { Zone, SeverityLevel } from '../../../types/domain.types';
import type { LayerVisibilityState, RiskMapFilterState } from '../types/risk-map.types';
import { OVERVIEW_DEMO_DATA } from '../../overview/data/overview.demo';

const INITIAL_LAYERS: LayerVisibilityState = {
  hazardZones: true,
  rainfallMesh: true,
  historicalScars: true,
  sensorStations: true,
};

const INITIAL_FILTERS: RiskMapFilterState = {
  searchQuery: '',
  selectedSeverity: 'ALL',
  minSlopeDegrees: 0,
};

export const useRiskMap = () => {
  const [layers, setLayers] = useState<LayerVisibilityState>(INITIAL_LAYERS);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [filters, setFilters] = useState<RiskMapFilterState>(INITIAL_FILTERS);

  const allZones = OVERVIEW_DEMO_DATA.zones;

  const toggleLayer = useCallback((layerKey: keyof LayerVisibilityState) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const selectZone = useCallback((zone: Zone | null) => {
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

  const setMinSlopeDegrees = useCallback((slope: number) => {
    setFilters((prev) => ({ ...prev, minSlopeDegrees: slope }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filteredZones = useMemo(() => {
    return allZones.filter((zone) => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = zone.name.toLowerCase().includes(query);
        const matchesId = zone.id.toLowerCase().includes(query);
        const matchesDistrict = (zone.district ?? '').toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesDistrict) return false;
      }

      // Severity filter
      if (filters.selectedSeverity !== 'ALL') {
        if (zone.current_severity !== filters.selectedSeverity) return false;
      }

      // Slope filter
      if (zone.slope < filters.minSlopeDegrees) return false;

      return true;
    });
  }, [allZones, filters]);

  return {
    layers,
    selectedZone,
    filters,
    filteredZones,
    allZonesCount: allZones.length,
    toggleLayer,
    selectZone,
    selectZoneById,
    setSearchQuery,
    setSelectedSeverity,
    setMinSlopeDegrees,
    resetFilters,
  };
};
