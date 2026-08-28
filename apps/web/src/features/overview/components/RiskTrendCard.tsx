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
    <Card className="p-4 bg-white border-slate-200 shadow-2xs flex flex-col justify-between h-[270px] lg:h-[290px]">
      {/* Compact Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
            72-Hour Regional Risk Trend
          </div>
        </div>

        <div className="text-right">
          <div className="text-base font-bold font-mono-data text-slate-900 leading-tight">
            {currentRisk.toFixed(2)}
            <span className="text-[11px] font-normal text-orange-600 ml-1">
              ({delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)})
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Line Visualization */}
      <div className="w-full flex-1 min-h-0 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              fontSize={10}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[0, 1.0]}
              ticks={[0.0, 0.3, 0.6, 0.8, 1.0]}
              stroke="#94a3b8"
              fontSize={10}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RiskTrendDataPoint;
                  return (
                    <div className="bg-white p-2 rounded-[6px] border border-slate-200 shadow-md text-xs space-y-1">
                      <div className="font-mono-data text-[10px] text-slate-400 uppercase font-semibold">
                        {item.timeLabel}
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
            <ReferenceLine
              y={0.60}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Warning (0.60)', fill: '#d97706', fontSize: 9, position: 'insideTopLeft' }}
            />
            <ReferenceLine
              y={0.80}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Critical (0.80)', fill: '#dc2626', fontSize: 9, position: 'insideTopLeft' }}
            />
            <Line
              type="monotone"
              dataKey="regionalRisk"
              stroke="#ea580c"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#ea580c' }}
              activeDot={{ r: 4, fill: '#ea580c' }}
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

      {/* Footer Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2 mt-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-orange-600 inline-block" />
            <span>Regional Avg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-red-600 inline-block border-t border-dashed border-red-600" />
            <span>Peak Catchment</span>
          </div>
        </div>
        <span className="font-mono-data text-slate-400">IMD & GSI Synoptic</span>
      </div>
    </Card>
  );
};
