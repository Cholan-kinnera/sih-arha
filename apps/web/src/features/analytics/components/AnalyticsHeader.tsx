import React from 'react';
import { Activity, ShieldAlert, TriangleAlert, CloudRain, Gauge } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { AnalyticsSummaryMetrics } from '../types/analytics.types';

export interface AnalyticsHeaderProps {
  metrics: AnalyticsSummaryMetrics;
  lastUpdatedTimestamp: string;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  metrics,
  lastUpdatedTimestamp,
}) => {
  return (
    <div className="space-y-3 pb-1 select-none">
      {/* Top Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
            Spatio-Temporal Risk Intelligence
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Regional Hazard Analytics & Evidence Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic risk trajectory curves, empirical threshold breach correlation, and multi-factor geotechnical susceptibility modeling.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <ProvenanceBadge type="SIMULATED" />
          <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[11px]">
            <DataFreshness lastUpdated={lastUpdatedTimestamp} />
          </div>
        </div>
      </div>

      {/* Unified Summary Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-[8px] p-3 shadow-2xs">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-[6px] bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Regional Avg Risk
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.regionalAvgRisk.toFixed(2)}{' '}
              <span className="text-[10px] font-normal text-slate-500">Index</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              72h Rainfall Peak
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.max72hRainfallMm.toFixed(1)}{' '}
              <span className="text-[10px] font-normal text-slate-500">mm</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <TriangleAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Warning Tier (≥0.60)
            </div>
            <div className="text-base font-bold font-mono-data text-orange-600 leading-tight">
              {metrics.zonesAboveWarningCount}{' '}
              <span className="text-[10px] font-normal text-slate-500">Sectors</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Critical Tier (≥0.80)
            </div>
            <div className="text-base font-bold font-mono-data text-red-600 leading-tight">
              {metrics.zonesAboveCriticalCount}{' '}
              <span className="text-[10px] font-normal text-slate-500">Sectors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
