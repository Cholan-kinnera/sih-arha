import React from 'react';
import { Search, Filter, RotateCcw, Clock } from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import type { SeverityLevel, AlertStatus } from '../../../types/domain.types';

export interface AlertsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSeverity: SeverityLevel | 'ALL';
  onSeverityChange: (severity: SeverityLevel | 'ALL') => void;
  selectedStatus: AlertStatus | 'ALL';
  onStatusChange: (status: AlertStatus | 'ALL') => void;
  timeWindow: 'ALL' | 'LAST_24H' | 'LAST_72H';
  onTimeWindowChange: (window: 'ALL' | 'LAST_24H' | 'LAST_72H') => void;
  visibleCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const AlertsToolbar: React.FC<AlertsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSeverity,
  onSeverityChange,
  selectedStatus,
  onStatusChange,
  timeWindow,
  onTimeWindowChange,
  visibleCount,
  totalCount,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedSeverity !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    timeWindow !== 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-[8px] p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search Input */}
        <div className="relative min-w-[200px] max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter alert ID, zone, or reason..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-sans"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value as SeverityLevel | 'ALL')}
            aria-label="Filter by Alert Severity"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer font-sans"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MODERATE">Moderate Only</option>
            <option value="LOW">Low Only</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as AlertStatus | 'ALL')}
            aria-label="Filter by Alert Status"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer font-sans"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active / Unacknowledged</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Time Window Filter */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-600 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={timeWindow}
            onChange={(e) => onTimeWindowChange(e.target.value as 'ALL' | 'LAST_24H' | 'LAST_72H')}
            aria-label="Filter by Time Window"
            className="bg-slate-50 border border-slate-200 rounded-[6px] px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer font-sans"
          >
            <option value="ALL">All Time</option>
            <option value="LAST_24H">Last 24 Hours</option>
            <option value="LAST_72H">Last 72 Hours</option>
          </select>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <IconButton
            aria-label="Reset Alert Filters"
            onClick={onResetFilters}
            size="sm"
            className="text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </IconButton>
        )}
      </div>

      {/* Visible Count */}
      <div className="text-[11px] font-mono-data text-slate-500 shrink-0">
        Showing <strong className="text-slate-900 font-bold">{visibleCount}</strong> / {totalCount} Alerts
      </div>
    </div>
  );
};
