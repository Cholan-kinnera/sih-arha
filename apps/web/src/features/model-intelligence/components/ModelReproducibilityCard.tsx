import React from 'react';
import { Terminal } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const ModelReproducibilityCard: React.FC = () => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-slate-100 text-slate-700 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Reproducibility & Scientific Provenance Metadata
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact schema configurations and reference parameters required for independent audit verification.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono-data text-slate-400">
          Schema: v2.4
        </span>
      </div>

      {/* 4-Item Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono-data">
        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
          <div className="text-[10px] text-slate-400 font-sans uppercase">Scoring Kernel</div>
          <div className="font-bold text-slate-900">Deterministic v1.0</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
          <div className="text-[10px] text-slate-400 font-sans uppercase">Feature Schema</div>
          <div className="font-bold text-slate-900">v2.4 (5 Covariates)</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
          <div className="text-[10px] text-slate-400 font-sans uppercase">Coordinate Frame</div>
          <div className="font-bold text-slate-900">WGS 84 / EPSG:4326</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
          <div className="text-[10px] text-slate-400 font-sans uppercase">Spatial Resolution</div>
          <div className="font-bold text-slate-900">30m DEM / Catchments</div>
        </div>
      </div>
    </Card>
  );
};
