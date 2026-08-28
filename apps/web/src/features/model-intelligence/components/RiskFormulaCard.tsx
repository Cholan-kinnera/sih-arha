import React from 'react';
import { Calculator } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const RiskFormulaCard: React.FC = () => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-4 font-sans select-none">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            Deterministic Scoring Engine: Mathematical Formulation
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          The baseline prototype hazard score is computed as a weighted linear combination of normalized meteorological, topographical, geotechnical, and historical covariates.
        </p>
      </div>

      {/* Formula Box */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-[6px] font-mono-data text-xs overflow-x-auto space-y-2 border border-slate-800 shadow-xs">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Primary Composite Susceptibility Equation
        </div>
        <div className="text-sm text-blue-400 font-bold leading-relaxed">
          R(z) = clamp[0, 1] ( 0.35·P̃_72h + 0.25·S̃_slope + 0.20·θ̃_soil + 0.10·P̃_24h + 0.10·D̃_scar )
        </div>
        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-1">
          <span>∑ w_i = 1.00 (100% Normalized)</span>
          <span>Output: Continuous Index [0.00 – 1.00]</span>
          <span>Engine: Deterministic-Linear v1.0</span>
        </div>
      </div>

      {/* 4-Step Pipeline Walkthrough */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-mono-data font-bold text-slate-400 uppercase">
            Step 1 · Ingestion
          </div>
          <div className="font-bold text-slate-800">Raw Sensor Feeds</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Extracts 24h/72h rainfall (mm), soil moisture (%), and slope (°) from telemetry and DEM rasters.
          </p>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-mono-data font-bold text-slate-400 uppercase">
            Step 2 · Normalization
          </div>
          <div className="font-bold text-slate-800">Min-Max Scaling</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Applies non-linear & empirical bounds to map physical variables onto a normalized [0, 1] domain.
          </p>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-mono-data font-bold text-slate-400 uppercase">
            Step 3 · Weighting
          </div>
          <div className="font-bold text-slate-800">Linear Combination</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Multiplies normalized covariates by calibrated physical factor weights summing to 100%.
          </p>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-mono-data font-bold text-slate-400 uppercase">
            Step 4 · Severity
          </div>
          <div className="font-bold text-slate-800">Threshold Mapping</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Maps composite score into Low, Moderate, High, or Critical operational severity bands.
          </p>
        </div>
      </div>
    </Card>
  );
};
