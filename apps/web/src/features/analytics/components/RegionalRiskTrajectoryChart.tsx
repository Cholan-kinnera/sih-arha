import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import type { TrajectoryDataPoint } from '../types/analytics.types';

export interface RegionalRiskTrajectoryChartProps {
  data: TrajectoryDataPoint[];
}

export const RegionalRiskTrajectoryChart: React.FC<RegionalRiskTrajectoryChartProps> = ({
  data,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title and Operational Purpose */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            72-Hour Regional Risk Trajectory & Peak Divergence
          </h3>
          <span className="text-[10px] font-mono-data text-slate-400">
            Units: Normalized Hazard Index (0.00 – 1.00)
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Temporal evolution of regional average hazard susceptibility versus maximum catchment vulnerability.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="displayTime"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as TrajectoryDataPoint;

                return (
                  <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-[6px] border border-slate-200 shadow-lg text-xs space-y-1.5 font-sans">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      Time: <span className="font-mono-data">{point.displayTime}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-indigo-700 font-medium">
                      <span>Regional Avg:</span>
                      <span className="font-mono-data font-bold">{point.regionalAverageRisk.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-red-600 font-medium">
                      <span>Peak Risk:</span>
                      <span className="font-mono-data font-bold">{point.peakZoneRisk.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-0.5 border-t border-slate-100">
                      Highest Risk Zone: <strong className="text-slate-800">{point.peakZoneName}</strong>
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

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={0.8}
              stroke="#dc2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'Critical (0.80)', position: 'right', fill: '#dc2626', fontSize: 10, fontFamily: 'monospace' }}
            />
            <ReferenceLine
              y={0.6}
              stroke="#ea580c"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'Warning (0.60)', position: 'right', fill: '#ea580c', fontSize: 10, fontFamily: 'monospace' }}
            />

            {/* Series Lines */}
            <Line
              type="monotone"
              dataKey="regionalAverageRisk"
              name="Regional Average Risk"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3, fill: '#4f46e5' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="peakZoneRisk"
              name="Peak Catchment Risk"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#dc2626' }}
              activeDot={{ r: 5.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Interpretation Note */}
      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
        <strong className="text-slate-700">Analytical Interpretation:</strong> Regional average hazard crossed the 0.60 warning threshold at T-24h due to sustained monsoon inflow across the Eastern Himalayas. Peak catchment vulnerability in East Sikkim reached critical threshold (0.84) at T-12h.
      </div>
    </Card>
  );
};
