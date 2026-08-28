import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import type { RainfallAccumulationPoint } from '../types/analytics.types';

export interface RainfallAccumulationChartProps {
  data: RainfallAccumulationPoint[];
}

export const RainfallAccumulationChart: React.FC<RainfallAccumulationChartProps> = ({
  data,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title and Operational Purpose */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            24-Hour vs. 72-Hour Cumulative Precipitation
          </h3>
          <span className="text-[10px] font-mono-data text-slate-400">
            Units: Millimeters (mm)
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Comparison of short-term intense rainfall versus 3-day antecedent ground saturation volume across priority sectors.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="zoneName"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              unit=" mm"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as RainfallAccumulationPoint;

                return (
                  <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-[6px] border border-slate-200 shadow-lg text-xs space-y-1 font-sans">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      {point.zoneName} ({point.zoneId})
                    </div>
                    <div className="flex justify-between gap-4 text-blue-600 font-medium">
                      <span>24h Rainfall:</span>
                      <span className="font-mono-data font-bold">{point.rain24hMm.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between gap-4 text-blue-900 font-medium">
                      <span>72h Rainfall:</span>
                      <span className="font-mono-data font-bold">{point.rain72hMm.toFixed(1)} mm</span>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-100">
                      Tier: <strong>{point.severity}</strong>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
              iconSize={8}
            />

            <Bar
              dataKey="rain24hMm"
              name="24h Rainfall (mm)"
              fill="#60a5fa"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="rain72hMm"
              name="72h Rainfall (mm)"
              fill="#1d4ed8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Operational Note */}
      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
        <strong className="text-slate-700">Antecedent Moisture Rule:</strong> Sustained 72h precipitation exceeding 250mm creates severe deep-seated saturation in colluvial soils, accelerating slope instability when combined with intense 24h downpours.
      </div>
    </Card>
  );
};
