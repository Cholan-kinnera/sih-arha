import React, { useState } from 'react';
import { useZones } from '../features/zones/hooks/useZones';
import { ZonesHeader } from '../features/zones/components/ZonesHeader';
import { ZonesPriorityGrid } from '../features/zones/components/ZonesPriorityGrid';
import { ZonesToolbar } from '../features/zones/components/ZonesToolbar';
import { ZonesTable } from '../features/zones/components/ZonesTable';
import { ZonesSkeleton } from '../features/zones/components/ZonesSkeleton';
import { ZoneDetailDrawer } from '../features/risk-map/components/ZoneDetailDrawer';

export const ZonesPage: React.FC = () => {
  const {
    filters,
    selectedZone,
    filteredZones,
    priorityZones,
    metrics,
    totalCount,
    visibleCount,
    selectZone,
    setSearchQuery,
    setSelectedSeverity,
    setMinRiskScore,
    setMinSlopeDegrees,
    setSortBy,
    resetFilters,
  } = useZones();

  const [isLoading] = useState(false);

  if (isLoading) {
    return <ZonesSkeleton />;
  }

  return (
    <div className="space-y-4 pb-4">
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
