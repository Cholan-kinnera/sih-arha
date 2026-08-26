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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <div className="text-[11px] font-bold tracking-wider text-blue-600 uppercase mb-0.5 select-none">
          Situation Awareness
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Landslide Risk Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
          Continuous geospatial risk intelligence, terrain susceptibility, and real-time hazard triage across monitored sectors.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-[6px] border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Regional Severity:</span>
          <RiskSeverityBadge severity={regionalSeverity} score={regionalRiskScore} />
        </div>
        <div className="hidden sm:flex items-center bg-white px-3 py-1.5 rounded-[6px] border border-slate-200 shadow-xs">
          <DataFreshness lastUpdated={lastUpdatedTimestamp} />
        </div>
      </div>
    </div>
  );
};
