import { useState, useMemo, useCallback } from 'react';
import type { SeverityLevel, AlertStatus } from '../../../types/domain.types';
import type {
  AlertDetailed,
  AlertFilterState,
  AlertsSummaryMetrics,
} from '../types/alerts.types';
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
  const [alerts, setAlerts] = useState<AlertDetailed[]>(ALERTS_DEMO_DATA);
  const [filters, setFilters] = useState<AlertFilterState>(INITIAL_FILTERS);
  const [selectedAlert, setSelectedAlert] = useState<AlertDetailed | null>(null);
  const [acknowledgingAlert, setAcknowledgingAlert] = useState<AlertDetailed | null>(null);

  const selectAlert = useCallback((alert: AlertDetailed | null) => {
    setSelectedAlert(alert);
  }, []);

  const openAcknowledgeModal = useCallback((alert: AlertDetailed) => {
    setAcknowledgingAlert(alert);
  }, []);

  const closeAcknowledgeModal = useCallback(() => {
    setAcknowledgingAlert(null);
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

  // Operator acknowledgment handler (Updates status & records audit history log)
  const acknowledgeAlert = useCallback(
    (alertId: string, dispatchNotes?: string) => {
      const nowIso = new Date().toISOString();
      const operatorName = 'Operator ID: OP-412 (Duty Officer)';

      setAlerts((prevAlerts) =>
        prevAlerts.map((alt) => {
          if (alt.id !== alertId) return alt;

          const updatedAudit = [
            ...alt.audit_history,
            {
              id: `AUD-${alt.id}-${alt.audit_history.length + 1}`,
              timestamp: nowIso,
              action: 'ACKNOWLEDGED' as const,
              operator: operatorName,
              notes: dispatchNotes || 'Alert acknowledged by duty operator. Triage logged in audit trail.',
            },
          ];

          const updatedAlert: AlertDetailed = {
            ...alt,
            status: 'ACKNOWLEDGED',
            acknowledged_at: nowIso,
            acknowledged_by: operatorName,
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
    },
    [selectedAlert]
  );

  // Filter and sort alerts deterministically
  const filteredAlerts = useMemo(() => {
    const filterTimeWindow = filters.timeWindow;
    const filterSearchQuery = filters.searchQuery.trim().toLowerCase();
    const filterSeverity = filters.selectedSeverity;
    const filterStatus = filters.selectedStatus;

    return alerts
      .filter((alert) => {
        // Search filter
        if (filterSearchQuery) {
          const matchesId = alert.id.toLowerCase().includes(filterSearchQuery);
          const matchesZone = (alert.zone_name ?? alert.zone_id).toLowerCase().includes(filterSearchQuery);
          const matchesReason = alert.reason.toLowerCase().includes(filterSearchQuery);
          const matchesDistrict = alert.district.toLowerCase().includes(filterSearchQuery);
          if (!matchesId && !matchesZone && !matchesReason && !matchesDistrict) {
            return false;
          }
        }

        // Severity filter
        if (filterSeverity !== 'ALL') {
          if (alert.severity !== filterSeverity) return false;
        }

        // Status filter
        if (filterStatus !== 'ALL') {
          if (alert.status !== filterStatus) return false;
        }

        // Time window filter
        if (filterTimeWindow !== 'ALL') {
          const limitMs = filterTimeWindow === 'LAST_24H' ? 24 * 3600 * 1000 : 72 * 3600 * 1000;
          if (Date.parse(alert.timestamp) + limitMs < Date.parse(alerts[0]?.timestamp ?? '')) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // 1. Critical > High > Moderate > Low
        const weightDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
        if (weightDiff !== 0) return weightDiff;
        // 2. Unacknowledged before Acknowledged
        if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
        if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') return 1;
        // 3. Newest timestamp first
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [alerts, filters]);

  // Operational metrics calculation
  const metrics: AlertsSummaryMetrics = useMemo(() => {
    const totalCount = alerts.length;
    const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
    const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
    const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
    const unacknowledgedCount = alerts.filter((a) => a.status === 'ACTIVE').length;
    const acknowledgedCount = alerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
    const last24hCount = alerts.length;

    return {
      totalCount,
      activeCount,
      criticalCount,
      highCount,
      unacknowledgedCount,
      acknowledgedCount,
      last24hCount,
    };
  }, [alerts]);

  return {
    alerts,
    filteredAlerts,
    selectedAlert,
    acknowledgingAlert,
    filters,
    metrics,
    totalCount: alerts.length,
    visibleCount: filteredAlerts.length,
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
