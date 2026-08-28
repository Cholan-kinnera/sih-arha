import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useDataSources } from '../features/data-sources/hooks/useDataSources';
import { DataHealthHeader } from '../features/data-sources/components/DataHealthHeader';
import { DataSourcesToolbar } from '../features/data-sources/components/DataSourcesToolbar';
import { SourceDirectoryTable } from '../features/data-sources/components/SourceDirectoryTable';
import { SourceDetailDrawer } from '../features/data-sources/components/SourceDetailDrawer';
import { RecentIngestionActivityPanel } from '../features/data-sources/components/RecentIngestionActivityPanel';
import { DataSourcesSkeleton } from '../features/data-sources/components/DataSourcesSkeleton';
import { Button } from '../components/ui/Button';

export const DataSourcesPage: React.FC = () => {
  const {
    filteredSources,
    selectedSource,
    recentEvents,
    filters,
    metrics,
    totalCount,
    visibleCount,
    isLoading,
    error,
    isBackendUnavailable,
    refetch,
    selectSource,
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    setSelectedProvenance,
    resetFilters,
  } = useDataSources();

  if (isLoading && filteredSources.length === 0) {
    return <DataSourcesSkeleton />;
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
              {error || 'Unable to connect to live API. Showing cached catalog entries.'}
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

      {/* 1. Ingestion Health Overview Strip */}
      <DataHealthHeader
        metrics={metrics}
        lastUpdatedTimestamp={new Date().toISOString()}
      />

      {/* 2. Source Filtering Toolbar */}
      <DataSourcesToolbar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={filters.selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={filters.selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedProvenance={filters.selectedProvenance}
        onProvenanceChange={setSelectedProvenance}
        visibleCount={visibleCount}
        totalCount={totalCount}
        onResetFilters={resetFilters}
      />

      {/* 3. Primary Data Source Directory Table */}
      <SourceDirectoryTable
        sources={filteredSources}
        onSelectSource={selectSource}
      />

      {/* 4. Global Ingestion Pipeline Activity Stream */}
      <RecentIngestionActivityPanel events={recentEvents} />

      {/* 5. Slide-Over Source Schema & Lineage Detail Drawer */}
      <SourceDetailDrawer
        source={selectedSource}
        onClose={() => selectSource(null)}
      />
    </div>
  );
};
