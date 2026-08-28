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
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import type { CaineAnalyticalPoint } from '../types/analytics.types';

export interface CaineThresholdAnalysisChartProps {
  data: CaineAnalyticalPoint[];
}

export const CaineThresholdAnalysisChart: React.FC<CaineThresholdAnalysisChartProps> = ({
  data,
}) => {
  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title and Operational Purpose */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            Rainfall Intensity-Duration vs. Empirical Caine Threshold
          </h3>
          <span className="text-[10px] font-mono-data text-slate-400">
            Formula: I = 14.82 · D⁻⁰·³⁹
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Empirical slope failure boundary (Caine 1980) compared against observed rainfall intensity across rainfall durations.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="durationHours"
              unit="h"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              unit=" mm/h"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as CaineAnalyticalPoint;

                return (
                  <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-[6px] border border-slate-200 shadow-lg text-xs space-y-1.5 font-sans">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      Duration: <span className="font-mono-data">{point.durationHours} Hours</span>
                    </div>
                    <div className="flex justify-between gap-4 text-blue-700 font-medium">
                      <span>Observed Intensity:</span>
                      <span className="font-mono-data font-bold">{point.observedIntensityMmPerHour.toFixed(2)} mm/h</span>
                    </div>
                    <div className="flex justify-between gap-4 text-red-600 font-medium">
                      <span>Caine Threshold:</span>
                      <span className="font-mono-data font-bold">{point.thresholdIntensityMmPerHour.toFixed(2)} mm/h</span>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-600 text-[11px] pt-0.5 border-t border-slate-100">
                      <span>Cumulative Rain:</span>
                      <span className="font-mono-data font-bold">{point.cumulativeRainfallMm.toFixed(1)} mm</span>
                    </div>
                    <div className="text-[10px] font-bold">
                      Status:{' '}
                      <span className={point.isBreached ? 'text-red-600' : 'text-emerald-600'}>
                        {point.isBreached ? 'THRESHOLD BREACHED' : 'STABLE'}
                      </span>
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

            {/* Caine Threshold Curve */}
            <Line
              type="monotone"
              dataKey="thresholdIntensityMmPerHour"
              name="Caine Threshold (I = 14.82·D⁻⁰·³⁹)"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#dc2626' }}
            />

            {/* Observed Intensity Curve */}
            <Line
              type="monotone"
              dataKey="observedIntensityMmPerHour"
              name="Observed Intensity (mm/h)"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#2563eb' }}
              activeDot={{ r: 5.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Operational Disclaimer Note */}
      <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
        <strong className="text-slate-600 font-semibold">Empirical Disclaimer:</strong> The Caine (1980) intensity-duration curve is an empirical analytical reference derived from global mountain catchment literature. It provides decision-support evidence and does not represent an accredited statutory deterministic prediction model.
      </div>
    </Card>
  );
};
