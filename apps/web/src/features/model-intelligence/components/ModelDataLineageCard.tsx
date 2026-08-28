import React from 'react';
import { Database } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import type { DataLineageEntry } from '../types/model-intelligence.types';

export interface ModelDataLineageCardProps {
  lineageEntries: DataLineageEntry[];
}

export const ModelDataLineageCard: React.FC<ModelDataLineageCardProps> = ({
  lineageEntries,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-4 font-sans select-none">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center">
          <Database className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            Data Lineage, Input Ingestion & Operational Constraints
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Documented origin, spatial coverage, and technical boundaries of all supporting model datasets.
          </p>
        </div>
      </div>

      {/* Lineage Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-[6px]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Data Provider</th>
              <th className="py-2.5 px-3">Dataset Title</th>
              <th className="py-2.5 px-3">Data Structure</th>
              <th className="py-2.5 px-3">Spatial Coverage</th>
              <th className="py-2.5 px-2 text-center">Cadence</th>
              <th className="py-2.5 px-3">Documented Constraints</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {lineageEntries.map((entry) => (
              <tr key={entry.datasetTitle} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-900 text-xs">
                  {entry.sourceName}
                </td>
                <td className="py-2.5 px-3 text-slate-700 text-xs">
                  {entry.datasetTitle}
                </td>
                <td className="py-2.5 px-3 text-slate-500 text-[11px] font-mono-data">
                  {entry.dataType}
                </td>
                <td className="py-2.5 px-3 text-slate-600 text-xs">
                  {entry.spatialCoverage}
                </td>
                <td className="py-2.5 px-2 text-center font-mono-data text-slate-700 text-xs">
                  {entry.updateFrequency}
                </td>
                <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs leading-snug">
                  {entry.limitations}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <ProvenanceBadge type={entry.provenance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
