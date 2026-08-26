import React from 'react';
import { Cpu } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const ModelIntelligencePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Model Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Heuristic scoring formulas, feature weight matrices, and validation benchmarks.
          </p>
        </div>
      </div>

      <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Explainability & Feature Weights</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Deterministic feature contributions, susceptibility scoring parameters, and model validation benchmarks are audited in this console.
          </p>
        </div>
      </Card>
    </div>
  );
};
