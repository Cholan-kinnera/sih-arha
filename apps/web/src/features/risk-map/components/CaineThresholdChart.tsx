import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CAINE_THRESHOLD_DATA } from '../data/risk-map.demo';

export const CaineThresholdChart: React.FC = () => {
  return (
    <div className="w-full h-36 pt-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={CAINE_THRESHOLD_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            fontSize={9}
            fontFamily="var(--font-mono)"
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            domain={[0, 40]}
            stroke="#94a3b8"
            fontSize={9}
            fontFamily="var(--font-mono)"
            tickLine={false}
            axisLine={false}
            unit="mm/h"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 rounded-[6px] border border-slate-200 shadow-md text-xs space-y-1">
                    <div className="font-mono-data text-[10px] text-slate-400 font-bold uppercase">
                      Duration: {data.label}
                    </div>
                    <div className="flex items-center justify-between gap-3 text-red-600 font-bold">
                      <span>Observed Intensity:</span>
                      <span className="font-mono-data">{data.currentIntensityMmHr} mm/h</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-slate-600 text-[11px]">
                      <span>Caine (1980) Limit:</span>
                      <span className="font-mono-data font-semibold">{data.caineThresholdMmHr} mm/h</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="currentIntensityMmHr"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 3, fill: '#dc2626' }}
            name="Current Intensity"
          />
          <Line
            type="monotone"
            dataKey="caineThresholdMmHr"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 2, fill: '#64748b' }}
            name="Caine Threshold"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
