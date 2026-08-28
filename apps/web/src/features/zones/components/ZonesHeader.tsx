import React from 'react';
import { Layers, ShieldAlert, TriangleAlert, CloudRain } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { ZonesSummaryMetrics } from '../types/zones.types';

export interface ZonesHeaderProps {
  metrics: ZonesSummaryMetrics;
  lastUpdatedTimestamp: string;
}

export const ZonesHeader: React.FC<ZonesHeaderProps> = ({
  metrics,
  lastUpdatedTimestamp,
}) => {
  return (
    <div className="space-y-3 pb-1 select-none">
      {/* Top Title & Provenance Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
            Basin Sector Intelligence
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Monitored Zones Directory & Susceptibility Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geotechnical catchment profiles, slope angles, precipitation metrics, and deterministic vulnerability indices.
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-[8px] p-3 shadow-2xs">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Monitored Sectors
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.totalZonesCount} <span className="text-[10px] font-normal text-slate-500">Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Critical Sectors
            </div>
            <div className="text-base font-bold font-mono-data text-red-600 leading-tight">
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
              High Risk Sectors
            </div>
            <div className="text-base font-bold font-mono-data text-orange-600 leading-tight">
              {metrics.highCount} <span className="text-[10px] font-normal text-slate-500">Tier 3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Peak 24h Rain
            </div>
            <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
              {metrics.max24hRainfallMm.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
