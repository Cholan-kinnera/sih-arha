import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useZones } from '../features/zones/hooks/useZones';
import { ZonesHeader } from '../features/zones/components/ZonesHeader';
import { ZonesPriorityGrid } from '../features/zones/components/ZonesPriorityGrid';
import { ZonesToolbar } from '../features/zones/components/ZonesToolbar';
import { ZonesTable } from '../features/zones/components/ZonesTable';
import { ZonesSkeleton } from '../features/zones/components/ZonesSkeleton';
import { ZoneDetailDrawer } from '../features/risk-map/components/ZoneDetailDrawer';
import { Button } from '../components/ui/Button';

export const ZonesPage: React.FC = () => {
  const {
    filters,
    selectedZone,
    filteredZones,
    priorityZones,
    metrics,
    totalCount,
    visibleCount,
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
    selectZone,
    setSearchQuery,
    setSelectedSeverity,
    setMinRiskScore,
    setMinSlopeDegrees,
    setSortBy,
    resetFilters,
  } = useZones();

  if (isLoading && filteredZones.length === 0) {
    return <ZonesSkeleton />;
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
              {error || 'Unable to connect to live API. Showing cached/demo baseline features.'}
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

      {/* 1. Page Header & Summary Strip */}
      <ZonesHeader
        metrics={metrics}
        lastUpdatedTimestamp={new Date().toISOString()}
      />

      {/* 2. Top Priority Triage Grid */}
      <ZonesPriorityGrid
        priorityZones={priorityZones}
        onSelectZone={selectZone}
      />

      {/* 3. Search, Filter & Sort Toolbar */}
      <ZonesToolbar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedSeverity={filters.selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        minRiskScore={filters.minRiskScore}
        onMinRiskScoreChange={setMinRiskScore}
        minSlope={filters.minSlopeDegrees}
        onMinSlopeChange={setMinSlopeDegrees}
        sortBy={filters.sortBy}
        onSortByChange={setSortBy}
        visibleCount={visibleCount}
        totalCount={totalCount}
        onResetFilters={resetFilters}
      />

      {/* 4. Complete Monitored Zones Directory Table */}
      <ZonesTable
        zones={filteredZones}
        onSelectZone={selectZone}
      />

      {/* 5. Shared Reusable Zone Intelligence Drawer */}
      <ZoneDetailDrawer
        zone={selectedZone}
        onClose={() => selectZone(null)}
      />
    </div>
  );
};
