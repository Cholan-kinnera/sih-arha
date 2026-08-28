import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import type {
  SourceStatus,
  SourceCategory,
} from '../types/data-sources.types';
import type { DataSourceType } from '../../../types/domain.types';

export interface DataSourcesToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: SourceStatus | 'ALL';
  onStatusChange: (status: SourceStatus | 'ALL') => void;
  selectedCategory: SourceCategory | 'ALL';
  onCategoryChange: (category: SourceCategory | 'ALL') => void;
  selectedProvenance: DataSourceType | 'ALL';
  onProvenanceChange: (prov: DataSourceType | 'ALL') => void;
  visibleCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const DataSourcesToolbar: React.FC<DataSourcesToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedProvenance,
  onProvenanceChange,
  visibleCount,
  totalCount,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedStatus !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedProvenance !== 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-[8px] p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs select-none font-sans">
      {/* Left: Filters & Search */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search */}
        <div className="relative min-w-[200px] max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter source name, provider, or domain..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as SourceStatus | 'ALL')}
            aria-label="Filter by Connection Status"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONNECTED">Connected Only</option>
            <option value="DEGRADED">Degraded Only</option>
            <option value="STALE">Stale Only</option>
            <option value="OFFLINE">Offline Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as SourceCategory | 'ALL')}
            aria-label="Filter by Data Category"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Meteorological Telemetry">Meteorological Telemetry</option>
            <option value="Geotechnical Probes">Geotechnical Probes</option>
            <option value="Terrain & Elevation">Terrain & Elevation</option>
            <option value="Historical Inventory">Historical Inventory</option>
            <option value="Spatial Catchment Mesh">Spatial Catchment Mesh</option>
          </select>
        </div>

        {/* Provenance Filter */}
        <div className="hidden sm:flex items-center gap-1.5">
          <select
            value={selectedProvenance}
            onChange={(e) => onProvenanceChange(e.target.value as DataSourceType | 'ALL')}
            aria-label="Filter by Data Lineage Provenance"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="ALL">All Provenances</option>
            <option value="SIMULATED">Simulated</option>
            <option value="DERIVED">Derived</option>
            <option value="HISTORICAL">Historical</option>
            <option value="REAL-WORLD">Real-World</option>
          </select>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <IconButton
            aria-label="Reset Data Source Filters"
            onClick={onResetFilters}
            size="sm"
            className="text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </IconButton>
        )}
      </div>

      {/* Right: Visible Count */}
      <div className="text-[11px] font-mono-data text-slate-500 shrink-0">
        Showing <strong className="text-slate-900 font-bold">{visibleCount}</strong> / {totalCount} Feeds
      </div>
    </div>
  );
};
