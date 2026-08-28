import React from 'react';
import { GitCompare, Clock, CheckCircle2, FlaskConical } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import type { MLModelComparison } from '../types/model-intelligence.types';

export interface ModelComparisonTableProps {
  models: MLModelComparison[];
}

export const ModelComparisonTable: React.FC<ModelComparisonTableProps> = ({ models }) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-4 font-sans select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-purple-50 text-purple-700 flex items-center justify-center">
            <GitCompare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Model Comparison: Deterministic Baseline vs. Experimental Machine Learning
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent benchmarking of operational heuristics against candidate statistical and tree-based classifiers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-data">
          <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
          <span>Research Pipeline v0.3</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-[6px]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Model Name & ID</th>
              <th className="py-2.5 px-3">Algorithm Class</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3">Validation Methodology</th>
              <th className="py-2.5 px-3">Training Dataset</th>
              <th className="py-2.5 px-3 text-center">ROC-AUC</th>
              <th className="py-2.5 px-3 text-center">Precision / Recall</th>
              <th className="py-2.5 px-3 text-right">Lineage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {models.map((m) => {
              const isActive = m.status === 'ACTIVE_PROTOTYPE';

              return (
                <tr
                  key={m.id}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    isActive ? 'bg-blue-50/20' : ''
                  }`}
                >
                  {/* Model Name */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 text-xs">{m.modelName}</div>
                    <div className="text-[10px] text-slate-400 font-mono-data">{m.id}</div>
                  </td>

                  {/* Algorithm */}
                  <td className="py-2.5 px-3 text-slate-700 text-xs">
                    {m.algorithm}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 text-center">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        ACTIVE BASELINE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        EVALUATION PENDING
                      </span>
                    )}
                  </td>

                  {/* Validation Method */}
                  <td className="py-2.5 px-3 text-slate-600 text-xs">
                    {m.validationMethod}
                  </td>

                  {/* Dataset */}
                  <td className="py-2.5 px-3 text-slate-600 text-xs">
                    {m.trainingDataset}
                  </td>

                  {/* ROC-AUC */}
                  <td className="py-2.5 px-3 text-center font-mono-data text-xs">
                    {m.rocAuc !== null ? (
                      <span className="font-bold text-slate-900">{m.rocAuc.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Pending</span>
                    )}
                  </td>

                  {/* Precision / Recall */}
                  <td className="py-2.5 px-3 text-center font-mono-data text-xs">
                    {m.precision !== null && m.recall !== null ? (
                      <span>{m.precision.toFixed(2)} / {m.recall.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Pending</span>
                    )}
                  </td>

                  {/* Lineage */}
                  <td className="py-2.5 px-3 text-right">
                    <ProvenanceBadge type={m.provenance} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Evaluation Readiness Statement */}
      <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-[6px] border border-slate-200/80 leading-relaxed">
        <strong className="text-slate-600 font-semibold">Evaluation Pipeline Guardrail:</strong> Machine learning evaluation metrics for experimental Random Forest and XGBoost models are marked as pending to ensure mathematical integrity until complete spatial cross-validation runs are executed against verified GSI landslide inventories.
      </div>
    </Card>
  );
};
