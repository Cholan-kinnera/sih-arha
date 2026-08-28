import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Zone, SeverityLevel } from '../../../types/domain.types';
import type { LayerVisibilityState, RiskMapFilterState } from '../types/risk-map.types';
import { getZones, getRiskMatrix, getZoneRisk, ApiError } from '../../../lib/api';
import { OVERVIEW_DEMO_DATA } from '../../overview/data/overview.demo';
import { useRealtimeStore } from '../../../stores/useRealtimeStore';

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
  const [apiZones, setApiZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const liveZoneRisks = useRealtimeStore((s) => s.liveZoneRisks);

  useEffect(() => {
    let isMounted = true;

    const loadMapData = async () => {
      try {
        const [zonesRes, riskRes] = await Promise.all([
          getZones({ is_ner: true, page: 1, page_size: 100 }),
          getRiskMatrix().catch(() => null),
        ]);

        if (!isMounted) return;

        const riskMap = new Map<string, { score: number; severity: SeverityLevel }>();
        if (riskRes?.evaluations) {
          riskRes.evaluations.forEach((ev) => {
            riskMap.set(ev.zone_id, {
              score: ev.dynamic_risk_score,
              severity: (ev.severity_level as SeverityLevel) || 'LOW',
            });
          });
        }

        // Merge with demo coordinates for rich polygons
        const demoMap = new Map(OVERVIEW_DEMO_DATA.zones.map((z) => [z.id, z]));

        const mapped: Zone[] = zonesRes.zones.map((z) => {
          const demoMatch = demoMap.get(z.zone_id);
          const riskInfo = riskMap.get(z.zone_id);
          const liveRisk = liveZoneRisks[z.zone_id];

          const finalScore = liveRisk?.dynamic_risk_score ?? riskInfo?.score ?? demoMatch?.current_risk_score ?? 0.1;
          const finalSev = (liveRisk?.severity_level as SeverityLevel) ?? riskInfo?.severity ?? demoMatch?.current_severity ?? 'LOW';

          return {
            id: z.zone_id,
            name: z.name,
            district: z.district,
            state: z.state,
            latitude: z.latitude || demoMatch?.latitude || 26.0,
            longitude: z.longitude || demoMatch?.longitude || 92.5,
            geometry: demoMatch?.geometry || { type: 'Polygon', coordinates: [] },
            slope: demoMatch?.slope || 15.0,
            elevation: demoMatch?.elevation || 850,
            soil_type: demoMatch?.soil_type || 'Mountain Colluvium',
            current_risk_score: finalScore,
            current_severity: finalSev,
            last_updated: new Date().toISOString(),
          };
        });

        setApiZones(mapped);
        setError(null);
        setIsBackendUnavailable(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn('[useRiskMap] API fetch error:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to load live risk map data.';
        setError(msg);
        setIsBackendUnavailable(true);
        setApiZones(OVERVIEW_DEMO_DATA.zones);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMapData();

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

  const allZones = apiZones.length > 0 ? apiZones : OVERVIEW_DEMO_DATA.zones;

  const toggleLayer = useCallback((layerKey: keyof LayerVisibilityState) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const selectZone = useCallback(async (zone: Zone | null) => {
    if (!zone) {
      setSelectedZone(null);
      return;
    }

    setSelectedZone(zone);

    // Fetch dynamic risk evaluation details
    try {
      const riskEval = await getZoneRisk(zone.id);
      if (riskEval) {
        setSelectedZone((prev) => {
          if (!prev || prev.id !== zone.id) return prev;
          return {
            ...prev,
            current_risk_score: riskEval.dynamic_risk_score,
            current_severity: (riskEval.severity_level as SeverityLevel) || prev.current_severity,
            last_updated: riskEval.timestamp_utc || new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[useRiskMap] Failed to load dynamic risk for selected zone:', err);
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

  const setMinSlopeDegrees = useCallback((slope: number) => {
    setFilters((prev) => ({ ...prev, minSlopeDegrees: slope }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filteredZones = useMemo(() => {
    return allZones.filter((zone) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = zone.name.toLowerCase().includes(query);
        const matchesId = zone.id.toLowerCase().includes(query);
        const matchesDistrict = (zone.district ?? '').toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesDistrict) return false;
      }

      if (filters.selectedSeverity !== 'ALL') {
        if (zone.current_severity !== filters.selectedSeverity) return false;
      }

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
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
    toggleLayer,
    selectZone,
    selectZoneById,
    setSearchQuery,
    setSelectedSeverity,
    setMinSlopeDegrees,
    resetFilters,
  };
};
