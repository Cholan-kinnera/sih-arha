import React, { useState } from 'react';
import { useAlerts } from '../features/alerts/hooks/useAlerts';
import { AlertsSummaryHeader } from '../features/alerts/components/AlertsSummaryHeader';
import { AlertsToolbar } from '../features/alerts/components/AlertsToolbar';
import { AlertsQueueTable } from '../features/alerts/components/AlertsQueueTable';
import { AlertDetailDrawer } from '../features/alerts/components/AlertDetailDrawer';
import { AlertAcknowledgeModal } from '../features/alerts/components/AlertAcknowledgeModal';
import { AlertsSkeleton } from '../features/alerts/components/AlertsSkeleton';

export const AlertsPage: React.FC = () => {
  const {
    filteredAlerts,
    selectedAlert,
    acknowledgingAlert,
    filters,
    metrics,
    totalCount,
    visibleCount,
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

  const [isLoading] = useState(false);

  if (isLoading) {
    return <AlertsSkeleton />;
  }

  return (
    <div className="space-y-4 pb-4">
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
      />
    </div>
  );
};
