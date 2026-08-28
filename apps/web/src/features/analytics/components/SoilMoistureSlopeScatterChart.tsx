import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import { SEVERITY_CONFIGS } from '../../../lib/risk-semantics';
import type { SoilSlopeScatterPoint } from '../types/analytics.types';

export interface SoilMoistureSlopeScatterChartProps {
  data: SoilSlopeScatterPoint[];
}

export const SoilMoistureSlopeScatterChart: React.FC<SoilMoistureSlopeScatterChartProps> = ({
  data,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title and Operational Purpose */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            Geotechnical Feature Correlation: Slope Gradient × Soil Saturation
          </h3>
          <span className="text-[10px] font-mono-data text-slate-400">
            Physical Multi-Factor Plane
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Exploratory relationship between terrain slope angle and soil pore pressure moisture saturation.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="slopeDegrees"
              name="Slope Angle"
              unit="°"
              domain={[0, 45]}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="soilMoisturePct"
              name="Soil Moisture"
              unit="%"
              domain={[30, 90]}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as SoilSlopeScatterPoint;

                return (
                  <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-[6px] border border-slate-200 shadow-lg text-xs space-y-1 font-sans">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      {point.zoneId} · {point.zoneName}
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Slope Gradient:</span>
                      <span className="font-mono-data font-bold text-amber-700">{point.slopeDegrees.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Soil Moisture:</span>
                      <span className="font-mono-data font-bold text-indigo-700">{point.soilMoisturePct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between gap-4 text-[11px] pt-0.5 border-t border-slate-100">
                      <span className="text-slate-500">Susceptibility Tier:</span>
                      <span className="font-mono-data font-bold text-slate-900">{point.severity} ({point.riskScore.toFixed(2)})</span>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter name="Monitored Sectors" data={data}>
              {data.map((entry) => {
                const config = SEVERITY_CONFIGS[entry.severity];
                return (
                  <Cell
                    key={entry.zoneId}
                    fill={config.colorHex}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Note */}
      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
        <strong className="text-slate-700">Exploratory Relationship:</strong> High-risk sectors cluster in the upper-right quadrant (Slope &gt; 30° and Soil Saturation &gt; 75%), where elevated pore pressures reduce terrain shear strength.
      </div>
    </Card>
  );
};
