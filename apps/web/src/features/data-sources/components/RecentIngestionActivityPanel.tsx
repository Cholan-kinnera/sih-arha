import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatRelativeTime } from '../../../lib/date-utils';
import type { IngestionEvent } from '../types/data-sources.types';

export interface RecentIngestionActivityPanelProps {
  events: IngestionEvent[];
}

export const RecentIngestionActivityPanel: React.FC<RecentIngestionActivityPanelProps> = ({
  events,
}) => {
  const getStatusBadge = (status: IngestionEvent['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            SUCCESS
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            PARTIAL
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            FAILED
          </span>
        );
    }
  };

  return (
    <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3 font-sans select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Global Ingestion Pipeline Activity Stream
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of recent automated polling operations, spatial mesh syncs, and telemetry ingestion events.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono-data text-slate-400">
          Auto-Refreshing Ingestion Log
        </span>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-[6px]">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Telemetry Feed</th>
              <th className="py-2.5 px-3">Ingestion Operation</th>
              <th className="py-2.5 px-2 text-center">Records</th>
              <th className="py-2.5 px-2 text-center">Latency</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3">Diagnostic Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono-data text-[11px] text-slate-500 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatRelativeTime(evt.timestamp)}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 text-xs">
                  {evt.sourceName}
                </td>
                <td className="py-2.5 px-3 text-slate-700 text-xs">
                  {evt.operation}
                </td>
                <td className="py-2.5 px-2 text-center font-mono-data font-bold text-slate-800 text-xs">
                  {evt.recordsProcessed}
                </td>
                <td className="py-2.5 px-2 text-center font-mono-data text-slate-500 text-xs">
                  {evt.durationMs}ms
                </td>
                <td className="py-2.5 px-3 text-center">
                  {getStatusBadge(evt.status)}
                </td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-snug max-w-sm">
                  {evt.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
