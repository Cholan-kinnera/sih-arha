import React from 'react';
import { Activity, Radio, Database, ShieldCheck, CloudRain, Droplets, Mountain } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { EnvironmentalTelemetryData } from '../types/overview.types';

export interface OverviewSystemStatusProps {
  lastUpdatedTimestamp: string;
  activeNodesCount: number;
  totalDataSourcesCount: number;
  telemetry?: EnvironmentalTelemetryData;
}

export const OverviewSystemStatus: React.FC<OverviewSystemStatusProps> = ({
  lastUpdatedTimestamp,
  activeNodesCount,
  totalDataSourcesCount,
  telemetry,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[8px] p-3 shadow-2xs space-y-2.5 text-xs select-none">
      {/* Top Row: Environmental Telemetry Snapshot */}
      {telemetry && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 px-3 py-2 rounded-[6px] border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono-data shrink-0">
            Environmental Snapshot
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-700 font-mono-data">
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] text-slate-400">RAIN 24H:</span>
              <span className="font-bold text-slate-900">{telemetry.rain24h.toFixed(1)} mm</span>
            </div>

            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span className="text-[11px] text-slate-400">RAIN 72H:</span>
              <span className="font-bold text-slate-900">{telemetry.rain72h.toFixed(1)} mm</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="text-[11px] text-slate-400">SOIL MOISTURE:</span>
              <span className="font-bold text-slate-900">{telemetry.maxSoilMoisturePercentage.toFixed(1)}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] text-slate-400">MAX SLOPE:</span>
              <span className="font-bold text-slate-900">{telemetry.maxSlopeDegrees.toFixed(1)}°</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Row: Operational Connection & System Health */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-0.5">
        {/* Left: Realtime Connection & Telemetry Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
            <span className="font-bold text-slate-900 text-[11px]">Realtime Stream:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full font-semibold border border-emerald-200 text-[10px]">
              Connected (LIVE)
            </span>
          </div>

          <div className="hidden sm:block h-3 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-1 text-slate-600 text-[11px]">
            <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong className="font-mono-data text-slate-900">{activeNodesCount}</strong> nodes active across{' '}
              <strong className="font-mono-data text-slate-900">{totalDataSourcesCount}</strong> data sources
            </span>
          </div>
        </div>

        {/* Right: Provenance, Simulation Mode & Freshness */}
        <div className="flex flex-wrap items-center gap-2.5">
          <ProvenanceBadge type="SIMULATED" />

          <div className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200 font-medium text-[10px]">
            <Activity className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Simulation Mode</span>
          </div>

          <div className="hidden sm:block h-3 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <DataFreshness lastUpdated={lastUpdatedTimestamp} />
          </div>
        </div>
      </div>
    </div>
  );
};
