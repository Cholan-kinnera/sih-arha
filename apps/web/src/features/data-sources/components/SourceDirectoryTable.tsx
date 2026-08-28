import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Inbox,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import type { DataSourceItem, SourceStatus, SourceFreshness } from '../types/data-sources.types';

export interface SourceDirectoryTableProps {
  sources: DataSourceItem[];
  onSelectSource: (source: DataSourceItem) => void;
}

export const SourceDirectoryTable: React.FC<SourceDirectoryTableProps> = ({
  sources,
  onSelectSource,
}) => {
  const getStatusBadge = (status: SourceStatus) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            CONNECTED
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            DEGRADED
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            STALE
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-400" />
            OFFLINE
          </span>
        );
    }
  };

  const getFreshnessBadge = (freshness: SourceFreshness, relativeTime: string) => {
    switch (freshness) {
      case 'FRESH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-data text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {relativeTime}
          </span>
        );
      case 'AGING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-data text-amber-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            {relativeTime}
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-data text-orange-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
            {relativeTime}
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-data text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {relativeTime}
          </span>
        );
    }
  };

  if (sources.length === 0) {
    return (
      <Card className="p-8 text-center bg-white border-slate-200 shadow-2xs">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No matching data sources</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No telemetry streams match your active search or category filter. Try clearing or adjusting your parameters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-white border-slate-200 shadow-2xs overflow-hidden select-none font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Source Name & Provider</th>
              <th className="py-3 px-3">Data Category</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Data Domain & Parameters</th>
              <th className="py-3 px-3">Cadence & Freshness</th>
              <th className="py-3 px-3">Spatial Coverage</th>
              <th className="py-3 px-2 text-center">Records</th>
              <th className="py-3 px-3 text-center">Lineage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {sources.map((src) => (
              <tr
                key={src.id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onSelectSource(src)}
              >
                {/* Source Name & Provider */}
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs">
                    {src.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-data font-semibold">
                    {src.id} · {src.provider}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-3 text-slate-700 text-xs">
                  {src.category}
                </td>

                {/* Status */}
                <td className="py-3 px-3 text-center">
                  {getStatusBadge(src.status)}
                </td>

                {/* Data Domain */}
                <td className="py-3 px-3 text-slate-600 text-xs max-w-xs leading-snug">
                  {src.dataDomain}
                </td>

                {/* Cadence & Freshness */}
                <td className="py-3 px-3">
                  <div className="text-[10px] text-slate-400 font-mono-data">
                    Every {src.expectedInterval}
                  </div>
                  <div className="mt-0.5">
                    {getFreshnessBadge(src.freshness, src.lastUpdatedRelative)}
                  </div>
                </td>

                {/* Spatial Coverage */}
                <td className="py-3 px-3 text-slate-600 text-xs max-w-xs truncate">
                  {src.spatialCoverage}
                </td>

                {/* Records Count */}
                <td className="py-3 px-2 text-center font-mono-data font-bold text-slate-900 text-xs">
                  {src.recordCount}
                </td>

                {/* Lineage Badge */}
                <td className="py-3 px-3 text-center">
                  <ProvenanceBadge type={src.provenance} />
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectSource(src)}
                    className="text-slate-600 hover:text-blue-600 text-[11px] h-7 px-2"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
