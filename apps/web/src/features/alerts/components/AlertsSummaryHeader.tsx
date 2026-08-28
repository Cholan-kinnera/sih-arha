import React from 'react';
import { BellRing, ShieldAlert, TriangleAlert, CheckCircle2, Clock } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { AlertsSummaryMetrics } from '../types/alerts.types';

export interface AlertsSummaryHeaderProps {
  metrics: AlertsSummaryMetrics;
  lastUpdatedTimestamp: string;
}

export const AlertsSummaryHeader: React.FC<AlertsSummaryHeaderProps> = ({
  metrics,
  lastUpdatedTimestamp,
}) => {
  return (
    <div className="space-y-3 pb-1 select-none">
      {/* Top Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-red-600 uppercase">
            Hazard Warning & Operational Triage
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-red-600" />
            Alert Operations Console & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hazard threshold breach warnings, operator acknowledgment logs, and verified emergency audit records.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <ProvenanceBadge type="SIMULATED" />
          <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[11px]">
            <DataFreshness lastUpdated={lastUpdatedTimestamp} />
          </div>
        </div>
      </div>

      {/* Unified Metric Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white border border-slate-200 rounded-[8px] p-3 shadow-2xs">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-[6px] bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Active Alerts
            </div>
            <div className="text-base font-bold font-mono-data text-red-600 leading-tight">
              {metrics.activeCount} <span className="text-[10px] font-normal text-slate-500">Pending</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-red-100/60 border border-red-300 flex items-center justify-center text-red-700 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Critical Tier
            </div>
            <div className="text-base font-bold font-mono-data text-red-700 leading-tight">
              {metrics.criticalCount} <span className="text-[10px] font-normal text-slate-500">Tier 4</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <TriangleAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              High Severity
            </div>
            <div className="text-base font-bold font-mono-data text-orange-600 leading-tight">
              {metrics.highCount} <span className="text-[10px] font-normal text-slate-500">Tier 3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Acknowledged
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.acknowledgedCount} <span className="text-[10px] font-normal text-slate-500">Logged</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Last 24 Hours
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.last24hCount} <span className="text-[10px] font-normal text-slate-500">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
