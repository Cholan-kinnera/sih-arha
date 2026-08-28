import React from 'react';
import { Search, Filter, RotateCcw, Map } from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import type { SeverityLevel } from '../../../types/domain.types';

export interface RiskMapToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSeverity: SeverityLevel | 'ALL';
  onSeverityChange: (severity: SeverityLevel | 'ALL') => void;
  minSlope: number;
  onMinSlopeChange: (slope: number) => void;
  visibleCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const RiskMapToolbar: React.FC<RiskMapToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSeverity,
  onSeverityChange,
  minSlope,
  onMinSlopeChange,
  visibleCount,
  totalCount,
  onResetFilters,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[8px] p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Left: Search & Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search Input */}
        <div className="relative min-w-[200px] max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter sector name or ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-sans"
          />
        </div>

        {/* Severity Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value as SeverityLevel | 'ALL')}
            aria-label="Filter by Risk Severity Tier"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer font-sans"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MODERATE">Moderate Only</option>
            <option value="LOW">Low Only</option>
          </select>
        </div>

        {/* Slope Angle Filter */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-600 font-mono-data text-[11px]">
          <span>Min Slope:</span>
          <select
            value={minSlope}
            onChange={(e) => onMinSlopeChange(Number(e.target.value))}
            aria-label="Filter by Minimum Terrain Slope Angle"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-1.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value={0}>0° (All Slopes)</option>
            <option value={20}>≥ 20°</option>
            <option value={30}>≥ 30°</option>
            <option value={35}>≥ 35° (Steep)</option>
          </select>
        </div>

        {/* Reset Action */}
        {(searchQuery || selectedSeverity !== 'ALL' || minSlope > 0) && (
          <IconButton
            aria-label="Reset Spatial Filters"
            onClick={onResetFilters}
            size="sm"
            className="text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </IconButton>
        )}
      </div>

      {/* Right: Sector Count & Region Label */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Map className="w-3.5 h-3.5 text-blue-600" />
          <span>North-Eastern Region (NER) Sector</span>
        </div>
        <span className="h-3 w-[1px] bg-slate-200" />
        <div className="text-[11px] font-mono-data text-slate-500">
          Showing <strong className="text-slate-900 font-bold">{visibleCount}</strong> / {totalCount} Sectors
        </div>
      </div>
    </div>
  );
};
