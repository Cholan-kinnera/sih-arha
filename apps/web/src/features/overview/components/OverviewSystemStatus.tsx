import React from 'react';
import { Activity, Radio, Database, ShieldCheck } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';

export interface OverviewSystemStatusProps {
  lastUpdatedTimestamp: string;
  activeNodesCount: number;
  totalDataSourcesCount: number;
}

export const OverviewSystemStatus: React.FC<OverviewSystemStatusProps> = ({
  lastUpdatedTimestamp,
  activeNodesCount,
  totalDataSourcesCount,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[8px] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs select-none">
      {/* Left: Realtime Connection & Telemetry Status */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
          <span className="font-semibold text-slate-900">Telemetry Stream:</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
            Connected (LIVE)
          </span>
        </div>

        <div className="hidden sm:block h-3.5 w-[1px] bg-slate-200" />

        <div className="flex items-center gap-1.5 text-slate-600">
          <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            <strong className="font-mono-data text-slate-900">{activeNodesCount}</strong> nodes active across{' '}
            <strong className="font-mono-data text-slate-900">{totalDataSourcesCount}</strong> data layers
          </span>
        </div>
      </div>

      {/* Right: Data Mode, Provenance & Freshness */}
      <div className="flex flex-wrap items-center gap-3">
        <ProvenanceBadge type="SIMULATED" />

        <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
          <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Synthetic Stream Mode</span>
        </div>

        <div className="hidden sm:block h-3.5 w-[1px] bg-slate-200" />

        <div className="flex items-center gap-1.5 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <DataFreshness lastUpdated={lastUpdatedTimestamp} />
        </div>
      </div>
    </div>
  );
};
