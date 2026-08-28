import { useState, useMemo, useCallback, useEffect } from 'react';
import type { SeverityLevel, AlertStatus } from '../../../types/domain.types';
import type {
  AlertDetailed,
  AlertFilterState,
  AlertsSummaryMetrics,
} from '../types/alerts.types';
import {
  getAlerts,
  acknowledgeAlert as apiAcknowledgeAlert,
  getAlertAuditTrail,
  ApiError,
} from '../../../lib/api';
import { ALERTS_DEMO_DATA } from '../data/alerts.demo';

const INITIAL_FILTERS: AlertFilterState = {
  searchQuery: '',
  selectedSeverity: 'ALL',
  selectedStatus: 'ALL',
  timeWindow: 'ALL',
};

const SEVERITY_WEIGHT: Record<SeverityLevel, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertDetailed[]>([]);
  const [filters, setFilters] = useState<AlertFilterState>(INITIAL_FILTERS);
  const [selectedAlert, setSelectedAlert] = useState<AlertDetailed | null>(null);
  const [acknowledgingAlert, setAcknowledgingAlert] = useState<AlertDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acknowledgeError, setAcknowledgeError] = useState<string | null>(null);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAlertsData = async () => {
      try {
        const res = await getAlerts({ page: 1, page_size: 50 });
        if (!isMounted) return;

        const mapped: AlertDetailed[] = res.alerts.map((a) => ({
          id: a.alert_id,
          zone_id: a.zone_id,
          zone_name: `Zone ${a.zone_id}`,
          district: 'Catchment Sector',
          state: 'North-Eastern Region',
          basin_sector: 'Brahmaputra / Barak River Basin',
          timestamp: a.created_at,
          severity: (a.severity as SeverityLevel) || 'HIGH',
          risk_score: a.risk_score,
          reason: a.trigger_reason,
          status: (a.status as AlertStatus) || 'ACTIVE',
          provenance: 'REAL-WORLD',
          trigger_metric: 'Dynamic Rainfall Rate & Terrain Slope',
          trigger_threshold_text: 'Dynamic score > 0.70',
          observed_value_text: `Dynamic score: ${a.risk_score.toFixed(2)}`,
          acknowledged_at: a.acknowledged_at || null,
          acknowledged_by: a.acknowledged_at ? 'Duty Operator' : null,
          dispatch_notes: null,
          soil_moisture_pct: 75,
          slope: 28,
          elevation: 850,
          soil_type: 'Mountain Colluvium',
          rain_24h_mm: 120,
          rain_72h_mm: 220,
          audit_history: [],
        }));

        setAlerts(mapped);
        setError(null);
        setIsBackendUnavailable(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn('[useAlerts] API fetch error:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to fetch alerts from backend.';
        setError(msg);
        setIsBackendUnavailable(true);
        setAlerts(ALERTS_DEMO_DATA);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAlertsData();

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

  const selectAlert = useCallback(async (alert: AlertDetailed | null) => {
    if (!alert) {
      setSelectedAlert(null);
      return;
    }

    setSelectedAlert(alert);

    // Fetch live audit trail
    try {
      const audits = await getAlertAuditTrail(alert.id);
      if (audits && audits.length > 0) {
        setSelectedAlert((prev) => {
          if (!prev || prev.id !== alert.id) return prev;
          return {
            ...prev,
            audit_history: audits.map((au) => ({
              id: `${au.alert_id}-${au.timestamp_utc}`,
              timestamp: au.timestamp_utc,
              action: (au.action as any) || 'ACKNOWLEDGED',
              operator: au.operator_id,
              notes: au.notes,
            })),
          };
        });
      }
    } catch (err) {
      console.warn('[useAlerts] Could not load alert audit trail:', err);
    }
  }, []);

  const openAcknowledgeModal = useCallback((alert: AlertDetailed) => {
    setAcknowledgeError(null);
    setAcknowledgingAlert(alert);
  }, []);

  const closeAcknowledgeModal = useCallback(() => {
    setAcknowledgingAlert(null);
    setAcknowledgeError(null);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedSeverity = useCallback((severity: SeverityLevel | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedSeverity: severity }));
  }, []);

  const setSelectedStatus = useCallback((status: AlertStatus | 'ALL') => {
    setFilters((prev) => ({ ...prev, selectedStatus: status }));
  }, []);

  const setTimeWindow = useCallback((window: 'ALL' | 'LAST_24H' | 'LAST_72H') => {
    setFilters((prev) => ({ ...prev, timeWindow: window }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Operator acknowledgment handler (Real POST request with audit log update)
  const acknowledgeAlert = useCallback(
    async (alertId: string, dispatchNotes?: string) => {
      setIsSubmitting(true);
      setAcknowledgeError(null);

      const operatorId = 'OP-412 (Duty Officer)';
      const notes = dispatchNotes || 'Alert acknowledged by duty operator. Triage logged in audit trail.';

      try {
        const updatedRes = await apiAcknowledgeAlert(alertId, {
          operator_id: operatorId,
          notes,
        });

        const nowIso = updatedRes.acknowledged_at || new Date().toISOString();

        setAlerts((prevAlerts) =>
          prevAlerts.map((alt) => {
            if (alt.id !== alertId) return alt;

            const updatedAudit = [
              ...alt.audit_history,
              {
                id: `AUD-${alt.id}-${Date.now()}`,
                timestamp: nowIso,
                action: 'ACKNOWLEDGED' as const,
                operator: operatorId,
                notes,
              },
            ];

            const updatedAlert: AlertDetailed = {
              ...alt,
              status: 'ACKNOWLEDGED',
              acknowledged_at: nowIso,
              acknowledged_by: operatorId,
              dispatch_notes: dispatchNotes || null,
              audit_history: updatedAudit,
            };

            if (selectedAlert && selectedAlert.id === alertId) {
              setSelectedAlert(updatedAlert);
            }

            return updatedAlert;
          })
        );

        setAcknowledgingAlert(null);
      } catch (err: unknown) {
        console.error('[useAlerts] Acknowledgment POST failed:', err);
        const msg = err instanceof ApiError ? err.userFriendlyMessage : 'Failed to acknowledge alert on server.';
        setAcknowledgeError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedAlert]
  );

  const allAlerts = alerts.length > 0 ? alerts : ALERTS_DEMO_DATA;

  // Filter and sort alerts deterministically
  const filteredAlerts = useMemo(() => {
    const filterTimeWindow = filters.timeWindow;
    const filterSearchQuery = filters.searchQuery.trim().toLowerCase();
    const filterSeverity = filters.selectedSeverity;
    const filterStatus = filters.selectedStatus;

    return allAlerts
      .filter((alert) => {
        if (filterSearchQuery) {
          const matchesId = alert.id.toLowerCase().includes(filterSearchQuery);
          const matchesZone = (alert.zone_name ?? alert.zone_id).toLowerCase().includes(filterSearchQuery);
          const matchesReason = alert.reason.toLowerCase().includes(filterSearchQuery);
          const matchesDistrict = alert.district.toLowerCase().includes(filterSearchQuery);
          if (!matchesId && !matchesZone && !matchesReason && !matchesDistrict) {
            return false;
          }
        }

        if (filterSeverity !== 'ALL') {
          if (alert.severity !== filterSeverity) return false;
        }

        if (filterStatus !== 'ALL') {
          if (alert.status !== filterStatus) return false;
        }

        if (filterTimeWindow !== 'ALL') {
          const limitMs = filterTimeWindow === 'LAST_24H' ? 24 * 3600 * 1000 : 72 * 3600 * 1000;
          if (Date.parse(alert.timestamp) + limitMs < Date.parse(allAlerts[0]?.timestamp ?? '')) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const weightDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
        if (weightDiff !== 0) return weightDiff;
        if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
        if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [allAlerts, filters]);

  // Operational metrics calculation
  const metrics: AlertsSummaryMetrics = useMemo(() => {
    const totalCount = allAlerts.length;
    const activeCount = allAlerts.filter((a) => a.status === 'ACTIVE').length;
    const criticalCount = allAlerts.filter((a) => a.severity === 'CRITICAL').length;
    const highCount = allAlerts.filter((a) => a.severity === 'HIGH').length;
    const unacknowledgedCount = allAlerts.filter((a) => a.status === 'ACTIVE').length;
    const acknowledgedCount = allAlerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
    const last24hCount = allAlerts.length;

    return {
      totalCount,
      activeCount,
      criticalCount,
      highCount,
      unacknowledgedCount,
      acknowledgedCount,
      last24hCount,
    };
  }, [allAlerts]);

  return {
    alerts: allAlerts,
    filteredAlerts,
    selectedAlert,
    acknowledgingAlert,
    filters,
    metrics,
    totalCount: allAlerts.length,
    visibleCount: filteredAlerts.length,
    isLoading,
    isSubmitting,
    error,
    acknowledgeError,
    isBackendUnavailable,
    refetch,
    selectAlert,
    openAcknowledgeModal,
    closeAcknowledgeModal,
    acknowledgeAlert,
    setSearchQuery,
    setSelectedSeverity,
    setSelectedStatus,
    setTimeWindow,
    resetFilters,
  };
};
