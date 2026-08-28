import React, { useState } from 'react';
import { useDataSources } from '../features/data-sources/hooks/useDataSources';
import { DataHealthHeader } from '../features/data-sources/components/DataHealthHeader';
import { DataSourcesToolbar } from '../features/data-sources/components/DataSourcesToolbar';
import { SourceDirectoryTable } from '../features/data-sources/components/SourceDirectoryTable';
import { SourceDetailDrawer } from '../features/data-sources/components/SourceDetailDrawer';
import { RecentIngestionActivityPanel } from '../features/data-sources/components/RecentIngestionActivityPanel';
import { DataSourcesSkeleton } from '../features/data-sources/components/DataSourcesSkeleton';

export const DataSourcesPage: React.FC = () => {
  const {
    filteredSources,
    selectedSource,
    recentEvents,
    filters,
    metrics,
    totalCount,
    visibleCount,
    selectSource,
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    setSelectedProvenance,
    resetFilters,
  } = useDataSources();

  const [isLoading] = useState(false);

  if (isLoading) {
    return <DataSourcesSkeleton />;
  }

  return (
    <div className="space-y-4 pb-4">
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
