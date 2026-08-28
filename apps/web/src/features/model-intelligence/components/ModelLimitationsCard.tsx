import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { ModelLimitation } from '../types/model-intelligence.types';

export interface ModelLimitationsCardProps {
  limitations: ModelLimitation[];
}

export const ModelLimitationsCard: React.FC<ModelLimitationsCardProps> = ({
  limitations,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Methodological Assumptions & Operational Boundaries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Documented technical boundaries and decision-support constraints for field operators and evaluators.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Governance</span>
        </div>
      </div>

      {/* Grid of Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {limitations.map((lim) => (
          <div
            key={lim.id}
            className="p-3 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 leading-snug">
                {lim.title}
              </span>
              <span className="text-[10px] font-mono-data font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {lim.category}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {lim.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
