import React from 'react';
import { Sliders, Database } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import type { FeatureWeightDefinition } from '../types/model-intelligence.types';

export interface FeatureWeightsCardProps {
  features: FeatureWeightDefinition[];
}

export const FeatureWeightsCard: React.FC<FeatureWeightsCardProps> = ({ features }) => {
  const totalWeight = features.reduce((sum, f) => sum + f.weightPct, 0);

  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-4 font-sans select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Physical Feature Weights & Contribution Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrated multi-factor weights derived from Himalayan & North-Eastern Region geomorphology literature.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono-data font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-[6px] border border-indigo-200">
          Total Weight: {totalWeight}%
        </div>
      </div>

      {/* Visual Weight Distribution Stacked Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {features.map((f, idx) => {
            const colors = [
              'bg-blue-600',
              'bg-amber-500',
              'bg-indigo-600',
              'bg-blue-400',
              'bg-slate-600',
            ];
            return (
              <div
                key={f.key}
                style={{ width: `${f.weightPct}%` }}
                className={`${colors[idx % colors.length]} h-full transition-all`}
                title={`${f.displayName}: ${f.weightPct}%`}
              />
            );
          })}
        </div>

        {/* Legend / Bar Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 text-xs">
          {features.map((f, idx) => {
            const dotColors = [
              'bg-blue-600',
              'bg-amber-500',
              'bg-indigo-600',
              'bg-blue-400',
              'bg-slate-600',
            ];
            return (
              <div
                key={f.key}
                className="flex items-center justify-between p-2 rounded-[6px] bg-slate-50 border border-slate-200/80"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColors[idx % dotColors.length]} shrink-0`} />
                  <span className="font-semibold text-slate-800 text-xs truncate max-w-[170px]">
                    {f.displayName}
                  </span>
                </div>
                <span className="font-mono-data font-bold text-slate-900 text-xs">
                  {f.weightPct}% ({f.weightDecimal.toFixed(2)})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Feature Dictionary Table */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Technical Parameter Dictionary</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-[6px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Variable Name</th>
                <th className="py-2.5 px-3">Feature Category</th>
                <th className="py-2.5 px-2 text-center">Unit</th>
                <th className="py-2.5 px-2 text-center">Weight</th>
                <th className="py-2.5 px-3">Physical Role & Mechanism</th>
                <th className="py-2.5 px-3">Normalization Rule</th>
                <th className="py-2.5 px-3 text-right">Lineage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {features.map((f) => (
                <tr key={f.key} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono-data font-bold text-blue-700 text-[11px]">
                    {f.variableName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-xs">
                    {f.category}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono-data text-slate-700 text-xs">
                    {f.unit}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono-data font-bold text-slate-900 text-xs">
                    {f.weightPct}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-xs max-w-xs leading-snug">
                    {f.role}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] leading-snug max-w-xs font-mono-data">
                    {f.normalizationRule}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <ProvenanceBadge type={f.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
