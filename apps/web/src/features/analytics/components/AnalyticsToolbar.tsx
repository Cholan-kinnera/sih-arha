import React from 'react';
import { Clock, Filter, RotateCcw, Compass } from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import type { AnalyticsTimeRange } from '../types/analytics.types';

export interface AnalyticsToolbarProps {
  timeRange: AnalyticsTimeRange;
  onTimeRangeChange: (range: AnalyticsTimeRange) => void;
  selectedBasin: string | 'ALL';
  onBasinChange: (basin: string | 'ALL') => void;
  onResetFilters: () => void;
}

export const AnalyticsToolbar: React.FC<AnalyticsToolbarProps> = ({
  timeRange,
  onTimeRangeChange,
  selectedBasin,
  onBasinChange,
  onResetFilters,
}) => {
  const isFiltered = timeRange !== '72H' || selectedBasin !== 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-[8px] p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Left: Time Range & Basin Selector */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Time Window */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium">Time Window:</span>
          <div className="inline-flex rounded-[6px] bg-slate-100 p-0.5 border border-slate-200">
            {(['24H', '48H', '72H'] as AnalyticsTimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onTimeRangeChange(range)}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-mono-data font-bold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Basin Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedBasin}
            onChange={(e) => onBasinChange(e.target.value)}
            aria-label="Filter by Drainage Catchment Basin"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer font-sans"
          >
            <option value="ALL">All NER Drainage Basins</option>
            <option value="Teesta">Teesta River Basin (Sikkim / North Bengal)</option>
            <option value="Brahmaputra">Brahmaputra Valley & Tributaries</option>
            <option value="Barak">Barak / Surma River Basin</option>
          </select>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <IconButton
            aria-label="Reset Analytics Filters"
            onClick={onResetFilters}
            size="sm"
            className="text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </IconButton>
        )}
      </div>

      {/* Right: Active Scope Context */}
      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono-data">
        <Compass className="w-3.5 h-3.5 text-indigo-600" />
        <span>North-Eastern Region Hazard Scope · SIMULATED</span>
      </div>
    </div>
  );
};
