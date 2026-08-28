import { useState, useCallback, useEffect } from 'react';
import type { Zone, Alert, SeverityLevel } from '../../../types/domain.types';
import type { OverviewDashboardData, OverviewKpiData } from '../types/overview.types';
import {
  getZones,
  getRiskMatrix,
  getAlerts,
  getDataSources,
  ApiError,
} from '../../../lib/api';
import { OVERVIEW_DEMO_DATA } from '../data/overview.demo';
import { useRealtimeStore } from '../../../stores/useRealtimeStore';

export const useOverview = () => {
  const [data, setData] = useState<OverviewDashboardData>(OVERVIEW_DEMO_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const liveZoneRisks = useRealtimeStore((s) => s.liveZoneRisks);

  useEffect(() => {
    let isMounted = true;

    const loadOverviewData = async () => {
      try {
        const [zonesRes, riskRes, alertsRes, sourcesRes] = await Promise.all([
          getZones({ page: 1, page_size: 50 }),
          getRiskMatrix().catch(() => null),
          getAlerts({ page: 1, page_size: 10 }).catch(() => null),
          getDataSources().catch(() => null),
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

        // Map demo polygon zones to real backend status
        const demoMap = new Map(OVERVIEW_DEMO_DATA.zones.map((z) => [z.id, z]));
        const mappedZones: Zone[] = zonesRes.zones.map((z) => {
          const demoMatch = demoMap.get(z.zone_id);
          const riskInfo = riskMap.get(z.zone_id);
          const liveRisk = liveZoneRisks[z.zone_id];

          const finalScore = liveRisk?.dynamic_risk_score ?? riskInfo?.score ?? demoMatch?.current_risk_score ?? 0.15;
          const finalSev = (liveRisk?.severity_level as SeverityLevel) ?? riskInfo?.severity ?? demoMatch?.current_severity ?? 'LOW';

          return {
            id: z.zone_id,
            name: z.name,
            district: z.district,
            state: z.state,
            latitude: z.latitude || demoMatch?.latitude || 26.0,
            longitude: z.longitude || demoMatch?.longitude || 92.5,
            geometry: demoMatch?.geometry || { type: 'Polygon', coordinates: [] },
            slope: demoMatch?.slope || 18.0,
            elevation: demoMatch?.elevation || 800,
            soil_type: demoMatch?.soil_type || 'Mountain Soil',
            current_risk_score: finalScore,
            current_severity: finalSev,
            last_updated: new Date().toISOString(),
          };
        });

        // Mapped Alerts
        const mappedAlerts: Alert[] = alertsRes?.alerts
          ? alertsRes.alerts.map((a) => ({
              id: a.alert_id,
              zone_id: a.zone_id,
              zone_name: `Zone ${a.zone_id}`,
              timestamp: a.created_at,
              severity: (a.severity as SeverityLevel) || 'HIGH',
              risk_score: a.risk_score,
              reason: a.trigger_reason,
              status: (a.status as any) || 'ACTIVE',
              acknowledged_at: a.acknowledged_at || null,
            }))
          : OVERVIEW_DEMO_DATA.alerts;

        // Real Severity Distribution
        const dist = riskRes?.severity_distribution || {
          CRITICAL: mappedZones.filter((z) => z.current_severity === 'CRITICAL').length,
          HIGH: mappedZones.filter((z) => z.current_severity === 'HIGH').length,
          MODERATE: mappedZones.filter((z) => z.current_severity === 'MODERATE').length,
          LOW: mappedZones.filter((z) => z.current_severity === 'LOW').length,
        };

        const criticalCount = dist.CRITICAL || 0;
        const highCount = dist.HIGH || 0;
        const unacknowledgedCount = mappedAlerts.filter((a) => a.status === 'ACTIVE').length;

        let regionalSeverity: SeverityLevel = 'LOW';
        let regionalRiskScore = 0.15;
        if (criticalCount > 0) {
          regionalSeverity = 'CRITICAL';
          regionalRiskScore = 0.85;
        } else if (highCount > 0) {
          regionalSeverity = 'HIGH';
          regionalRiskScore = 0.72;
        } else if ((dist.MODERATE || 0) > 0) {
          regionalSeverity = 'MODERATE';
          regionalRiskScore = 0.45;
        }

        const kpiData: OverviewKpiData = {
          monitoredZonesCount: zonesRes.total || mappedZones.length,
          regionalRiskScore,
          regionalSeverity,
          regionalRiskTrendText: '+4.2% vs 24h baseline',
          criticalAlertsCount: criticalCount,
          unacknowledgedAlertsCount: unacknowledgedCount,
          peakRainfall24h: 184.2,
          peakRainfallZoneName: 'Meppadi Sector 4',
        };

        const overviewPayload: OverviewDashboardData = {
          kpis: kpiData,
          zones: mappedZones.length > 0 ? mappedZones : OVERVIEW_DEMO_DATA.zones,
          alerts: mappedAlerts,
          riskTrend: OVERVIEW_DEMO_DATA.riskTrend,
          activeTelemetryNodesCount: 18,
          totalDataSourcesCount: sourcesRes?.total || 5,
          environmentalTelemetry: OVERVIEW_DEMO_DATA.environmentalTelemetry,
          lastUpdatedTimestamp: new Date().toISOString(),
          provenance: 'SIMULATED',
        };

        setData(overviewPayload);
        setError(null);
        setIsBackendUnavailable(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn('[useOverview] API fetch error:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to fetch overview metrics from backend.';
        setError(msg);
        setIsBackendUnavailable(true);
        setData(OVERVIEW_DEMO_DATA);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOverviewData();

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

  return {
    data,
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
  };
};
