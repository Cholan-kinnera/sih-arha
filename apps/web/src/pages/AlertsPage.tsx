import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAlerts } from '../features/alerts/hooks/useAlerts';
import { AlertsSummaryHeader } from '../features/alerts/components/AlertsSummaryHeader';
import { AlertsToolbar } from '../features/alerts/components/AlertsToolbar';
import { AlertsQueueTable } from '../features/alerts/components/AlertsQueueTable';
import { AlertDetailDrawer } from '../features/alerts/components/AlertDetailDrawer';
import { AlertAcknowledgeModal } from '../features/alerts/components/AlertAcknowledgeModal';
import { AlertsSkeleton } from '../features/alerts/components/AlertsSkeleton';
import { Button } from '../components/ui/Button';

export const AlertsPage: React.FC = () => {
  const {
    filteredAlerts,
    selectedAlert,
    acknowledgingAlert,
    filters,
    metrics,
    totalCount,
    visibleCount,
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
  } = useAlerts();

  if (isLoading && filteredAlerts.length === 0) {
    return <AlertsSkeleton />;
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Backend / Network Alert Banner if degraded */}
      {isBackendUnavailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-[6px] p-3 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Backend Connectivity Degraded:</span>{' '}
              {error || 'Unable to connect to live API. Showing cached/simulated alert feed.'}
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => refetch()}
            className="shrink-0 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </Button>
        </div>
      )}

      {/* 1. Summary Header & Metrics Strip */}
      <AlertsSummaryHeader
        metrics={metrics}
        lastUpdatedTimestamp={new Date().toISOString()}
      />

      {/* 2. Triage Toolbar (Search, Severity, Status, Time Window) */}
      <AlertsToolbar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedSeverity={filters.selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedStatus={filters.selectedStatus}
        onStatusChange={setSelectedStatus}
        timeWindow={filters.timeWindow}
        onTimeWindowChange={setTimeWindow}
        visibleCount={visibleCount}
        totalCount={totalCount}
        onResetFilters={resetFilters}
      />

      {/* 3. Primary Operational Alert Feed Table */}
      <AlertsQueueTable
        alerts={filteredAlerts}
        onSelectAlert={selectAlert}
        onAcknowledgeAlert={openAcknowledgeModal}
      />

      {/* 4. Slide-Over Contextual Alert Intelligence Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        onClose={() => selectAlert(null)}
        onOpenAcknowledgeModal={openAcknowledgeModal}
      />

      {/* 5. Deliberate Confirmation Modal for Operator Acknowledgment */}
      <AlertAcknowledgeModal
        alert={acknowledgingAlert}
        onClose={closeAcknowledgeModal}
        onConfirm={acknowledgeAlert}
        isSubmitting={isSubmitting}
        error={acknowledgeError}
      />
    </div>
  );
};
