import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { RiskTrendDataPoint } from '../types/overview.types';

export interface RiskTrendCardProps {
  data: RiskTrendDataPoint[];
}

export const RiskTrendCard: React.FC<RiskTrendCardProps> = ({ data }) => {
  const currentRisk = data[data.length - 1]?.regionalRisk ?? 0.68;
  const initialRisk = data[0]?.regionalRisk ?? 0.24;
  const delta = currentRisk - initialRisk;

  return (
    <Card className="p-5 bg-white border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
            72-Hour Regional Risk Trend
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">
            Precipitation-Driven Instability Index
          </h3>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-lg font-bold font-mono-data text-slate-900">
            {currentRisk.toFixed(2)}
            <span className="text-xs font-normal text-orange-600 ml-1">
              ({delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)} in 72h)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Trajectory: Accelerating</div>
        </div>
      </div>

      {/* Recharts Line Visualization */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[0, 1.0]}
              ticks={[0.0, 0.3, 0.6, 0.8, 1.0]}
              stroke="#94a3b8"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RiskTrendDataPoint;
                  return (
                    <div className="bg-white p-2.5 rounded-[6px] border border-slate-200 shadow-md text-xs space-y-1">
                      <div className="font-mono-data text-[10px] text-slate-400 uppercase font-semibold">
                        Timestamp: {item.timeLabel}
                      </div>
                      <div className="font-bold text-slate-900 flex items-center justify-between gap-3">
                        <span>Regional Risk:</span>
                        <span className="font-mono-data text-orange-600">{item.regionalRisk.toFixed(2)}</span>
                      </div>
                      <div className="text-slate-600 flex items-center justify-between gap-3 text-[11px]">
                        <span>Peak Sector:</span>
                        <span className="font-mono-data font-bold text-red-600">{item.peakZoneRisk.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Warning and Critical Threshold Reference Lines */}
            <ReferenceLine
              y={0.60}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Warning (0.60)', fill: '#d97706', fontSize: 10, position: 'insideTopLeft' }}
            />
            <ReferenceLine
              y={0.80}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Critical (0.80)', fill: '#dc2626', fontSize: 10, position: 'insideTopLeft' }}
            />
            <Line
              type="monotone"
              dataKey="regionalRisk"
              stroke="#ea580c"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ea580c' }}
              activeDot={{ r: 5, fill: '#ea580c' }}
            />
            <Line
              type="monotone"
              dataKey="peakZoneRisk"
              stroke="#dc2626"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={{ r: 2, fill: '#dc2626' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Caption */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-orange-600 inline-block" />
            <span>Regional Avg Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-600 inline-block border-t border-dashed border-red-600" />
            <span>Peak Catchment Risk</span>
          </div>
        </div>
        <span className="font-mono-data text-slate-400">IMD & GSI Synoptic Cycle</span>
      </div>
    </Card>
  );
};
