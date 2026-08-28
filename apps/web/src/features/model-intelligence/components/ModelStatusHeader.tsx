import React from 'react';
import { Cpu, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { DataFreshness } from '../../../components/layout/DataFreshness';
import type { ModelMetadata } from '../types/model-intelligence.types';

export interface ModelStatusHeaderProps {
  metadata: ModelMetadata;
  lastUpdatedTimestamp: string;
}

export const ModelStatusHeader: React.FC<ModelStatusHeaderProps> = ({
  metadata,
  lastUpdatedTimestamp,
}) => {
  return (
    <div className="space-y-3 pb-1 select-none font-sans">
      {/* Top Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
            Algorithm Transparency & Methodology
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Model Intelligence & Scoring Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic hydro-terrain hazard formulation, physical factor weight distributions, and experimental ML validation pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <ProvenanceBadge type="SIMULATED" />
          <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[6px] border border-slate-200 shadow-2xs text-[11px]">
            <DataFreshness lastUpdated={lastUpdatedTimestamp} />
          </div>
        </div>
      </div>

      {/* Model Overview Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-[8px] p-3 shadow-2xs">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Active Engine
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">
              Deterministic v0.1
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Engine Status
            </div>
            <div className="text-xs font-bold text-emerald-700 font-mono-data leading-tight">
              ACTIVE PROTOTYPE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Feature Pipeline
            </div>
            <div className="text-xs font-bold font-mono-data text-slate-900 leading-tight">
              {metadata.featuresCount} Factors (100% Sum)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-[6px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider font-mono-data">
              Output Metric
            </div>
            <div className="text-xs font-bold font-mono-data text-slate-900 leading-tight">
              0.00 – 1.00 Index
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
