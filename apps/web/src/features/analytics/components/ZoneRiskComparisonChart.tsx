import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import { SEVERITY_CONFIGS } from '../../../lib/risk-semantics';
import type { ZoneRiskComparisonPoint } from '../types/analytics.types';

export interface ZoneRiskComparisonChartProps {
  data: ZoneRiskComparisonPoint[];
}

export const ZoneRiskComparisonChart: React.FC<ZoneRiskComparisonChartProps> = ({
  data,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title and Operational Purpose */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            Catchment Risk Score Comparison & Baseline Divergence
          </h3>
          <span className="text-[10px] font-mono-data text-slate-400">
            Regional Baseline: 0.68 Index
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic ranking of monitored sectors by composite vulnerability score relative to the basin average.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="zoneName"
              tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              width={140}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as ZoneRiskComparisonPoint;

                return (
                  <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-[6px] border border-slate-200 shadow-lg text-xs space-y-1 font-sans">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      {point.zoneId} · {point.zoneName}
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Risk Score:</span>
                      <span className="font-mono-data font-bold text-slate-900">{point.riskScore.toFixed(2)} ({point.severity})</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Slope:</span>
                      <span className="font-mono-data font-bold text-slate-700">{point.slope.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Soil Saturation:</span>
                      <span className="font-mono-data font-bold text-slate-700">{point.soilMoisturePct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between gap-4 text-[11px] pt-0.5 border-t border-slate-100">
                      <span className="text-slate-500">72h Rainfall:</span>
                      <span className="font-mono-data font-bold text-blue-600">{point.rain72hMm.toFixed(1)} mm</span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Regional Baseline Marker */}
            <ReferenceLine
              x={0.68}
              stroke="#6366f1"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{ value: 'Basin Avg (0.68)', position: 'top', fill: '#6366f1', fontSize: 10, fontFamily: 'monospace' }}
            />

            <Bar dataKey="riskScore" radius={[0, 4, 4, 0]}>
              {data.map((entry) => {
                const config = SEVERITY_CONFIGS[entry.severity];
                return <Cell key={entry.zoneId} fill={config.colorHex} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Interpretation */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono-data">
        <span>Sectors &gt; 0.68 index exhibit elevated risk divergence.</span>
        <span>Ranked Deterministically</span>
      </div>
    </Card>
  );
};
