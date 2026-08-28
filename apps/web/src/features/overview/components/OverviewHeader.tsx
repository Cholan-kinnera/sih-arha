import React from 'react';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { SeverityLevel } from '../../../types/domain.types';

export interface OverviewHeaderProps {
  regionalSeverity: SeverityLevel;
  regionalRiskScore: number;
  lastUpdatedTimestamp: string;
}

export const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  regionalSeverity,
  regionalRiskScore,
  lastUpdatedTimestamp,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
      <div>
        <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase select-none">
          Situation Awareness
        </div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Landslide Risk Overview
          </h1>
          <p className="hidden md:inline-block text-xs text-slate-500">
            Current geospatial risk intelligence across monitored zones.
          </p>
        </div>
        <p className="md:hidden text-xs text-slate-500 mt-0.5">
          Current geospatial risk intelligence across monitored zones.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Regional Severity:</span>
          <RiskSeverityBadge severity={regionalSeverity} score={regionalRiskScore} />
        </div>
        <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[11px]">
          <DataFreshness lastUpdated={lastUpdatedTimestamp} />
        </div>
      </div>
    </div>
  );
};
