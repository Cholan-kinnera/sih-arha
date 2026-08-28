import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProvenanceBadge } from '../components/data/ProvenanceBadge';

export const ModelIntelligencePage: React.FC = () => {
  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase select-none">
            Predictive Model Governance
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Model Intelligence & Susceptibility Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Heuristic scoring formulas, feature weight parameters, and deterministic hazard validation benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="SIMULATED" />
          <Badge variant="success" size="sm">
            Model Status: Validated
          </Badge>
        </div>
      </div>

      {/* Feature Weight Matrix Grid */}
      <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Deterministic Feature Weight Allocations
          </h3>
          <span className="text-[10px] font-mono-data text-slate-400">Total Weight: 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>72h Cumulative Rainfall</span>
              <span className="font-mono-data text-blue-600">35% Weight</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Primary trigger index measuring continuous precipitation volume relative to IMD historical baselines.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Terrain Slope Gradient</span>
              <span className="font-mono-data text-amber-600">25% Weight</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Digital Elevation Model (DEM) steepness derivation. Slopes &gt;25° incur non-linear risk escalation.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Soil Moisture Saturation</span>
              <span className="font-mono-data text-indigo-600">25% Weight</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Geotechnical pore pressure calculation estimating liquid phase transition thresholds in clayey colluvium.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Historical Landslide Proximity</span>
              <span className="font-mono-data text-slate-700">15% Weight</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Geological Survey of India (GSI) historical scar inventory & fault-line buffer zone indexing.
            </p>
          </div>
        </div>
      </Card>

      {/* Validation Benchmark Note */}
      <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200 rounded-[6px] p-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Operational Model Audit:</strong> All susceptibility calculations use auditable, deterministic formulas grounded in GSI & IMD empirical hazard guidelines.
        </span>
      </div>
    </div>
  );
};
