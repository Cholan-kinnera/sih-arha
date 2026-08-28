import React from 'react';
import { Database, CheckCircle2, AlertTriangle, XCircle, Layers } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { DataHealthSummaryMetrics } from '../types/data-sources.types';

export interface DataHealthHeaderProps {
  metrics: DataHealthSummaryMetrics;
  lastUpdatedTimestamp: string;
}

export const DataHealthHeader: React.FC<DataHealthHeaderProps> = ({
  metrics,
  lastUpdatedTimestamp,
}) => {
  return (
    <div className="space-y-3 pb-1 select-none font-sans">
      {/* Top Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
            Data Lineage & Ingestion Observability
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Data Sources Directory & Ingestion Health
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active telemetry pipeline status, spatial coverage frames, schema dictionaries, and documented ingestion constraints.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <ProvenanceBadge type="SIMULATED" />
          <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[11px]">
            <DataFreshness lastUpdated={lastUpdatedTimestamp} />
          </div>
        </div>
      </div>

      {/* Summary Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white border border-slate-200 rounded-[8px] p-3 shadow-2xs">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Total Feeds
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.totalSourcesCount} <span className="text-[10px] font-normal text-slate-500">Configured</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Healthy Active
            </div>
            <div className="text-base font-bold font-mono-data text-emerald-700 leading-tight">
              {metrics.healthySourcesCount} <span className="text-[10px] font-normal text-slate-500">Connected</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Degraded / Stale
            </div>
            <div className="text-base font-bold font-mono-data text-amber-700 leading-tight">
              {metrics.staleSourcesCount} <span className="text-[10px] font-normal text-slate-500">Aging</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Offline / Pending
            </div>
            <div className="text-base font-bold font-mono-data text-slate-700 leading-tight">
              {metrics.offlineSourcesCount} <span className="text-[10px] font-normal text-slate-500">Endpoint</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Indexed Records
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.totalRecordsCount} <span className="text-[10px] font-normal text-slate-500">Entities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
