import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Globe,
  Tag,
  Server,
  Activity,
} from 'lucide-react';
import { IconButton } from '../../../components/ui/IconButton';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { drawerVariants } from '../../../lib/motion';
import { formatRelativeTime } from '../../../lib/date-utils';
import type { DataSourceItem } from '../types/data-sources.types';

export interface SourceDetailDrawerProps {
  source: DataSourceItem | null;
  onClose: () => void;
}

export const SourceDetailDrawer: React.FC<SourceDetailDrawerProps> = ({
  source,
  onClose,
}) => {
  if (!source) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={source.id}
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-14 right-0 bottom-0 z-40 w-full sm:w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col font-sans"
      >
        {/* SECTION 1: IDENTITY & PROVENANCE HEADER */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/90 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono-data font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {source.id}
              </span>
              <ProvenanceBadge type={source.provenance} />
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{source.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Provider: {source.provider}
            </p>
          </div>
          <IconButton
            aria-label="Close Data Source Details"
            onClick={onClose}
            size="sm"
            className="text-slate-400 hover:text-slate-700 shrink-0"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {/* SECTION 2: CONNECTION HEALTH & REFRESH SLA */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Connection Health & Refresh SLA
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium">Ingestion Status</div>
                <div className="font-bold flex items-center gap-1.5 pt-0.5">
                  {source.status === 'CONNECTED' && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-mono-data">CONNECTED</span>
                    </>
                  )}
                  {source.status === 'DEGRADED' && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-700 font-mono-data">DEGRADED</span>
                    </>
                  )}
                  {source.status === 'OFFLINE' && (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 font-mono-data">OFFLINE</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium">Expected Cadence</div>
                <div className="font-bold font-mono-data text-slate-900 pt-0.5">
                  {source.expectedInterval}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 text-xs flex items-center justify-between">
              <span className="text-slate-500 font-medium">Last Successful Poll:</span>
              <span className="font-mono-data font-bold text-slate-900">{source.lastUpdatedRelative}</span>
            </div>
          </div>

          {/* SECTION 3: DATA DOMAIN & SCHEMA FIELDS */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Data Domain & Ingestion Schema
            </span>

            <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 text-xs text-slate-700 leading-snug">
              <strong className="text-slate-900 block mb-1">Observed Domain:</strong>
              {source.dataDomain}
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono-data">
                Schema Fields ({source.schemaFields.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {source.schemaFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-mono-data border border-blue-200"
                  >
                    <Tag className="w-3 h-3 text-blue-500" />
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: SPATIAL METADATA & COVERAGE */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Spatial Frame & Resolution
            </span>

            <div className="bg-slate-50 p-3 rounded-[6px] border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Geographic Coverage:
                </span>
                <span className="font-semibold text-slate-900">{source.spatialCoverage}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Coordinate Frame:</span>
                <span className="font-mono-data font-bold text-slate-900">{source.coordinateSystem}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Spatial Resolution:</span>
                <span className="font-mono-data text-slate-700">{source.spatialResolution}</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: INGESTION ENDPOINT & TRANSPORT */}
          <div className="pt-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Ingestion Endpoint & Transport Protocol
            </span>
            <div className="p-2.5 bg-slate-900 text-slate-100 rounded-[6px] font-mono-data text-[11px] border border-slate-800 break-all">
              <div className="flex items-center gap-1 text-slate-400 mb-1 text-[10px] uppercase">
                <Server className="w-3 h-3 text-blue-400" /> Gateway URI
              </div>
              {source.endpointType}
            </div>
          </div>

          {/* SECTION 6: DOCUMENTED LIMITATIONS */}
          <div className="pt-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Documented Ingestion Constraints
            </span>
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
              {source.limitations}
            </p>
          </div>

          {/* SECTION 7: RECENT INGESTION EVENTS */}
          <div className="pt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recent Ingestion Event History
              </span>
              <span className="text-[10px] font-mono-data text-slate-400">
                {source.recentEvents.length} Events Logged
              </span>
            </div>

            {source.recentEvents.length === 0 ? (
              <div className="text-slate-400 text-xs p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-center">
                No recent automated ingestion events recorded for this static baseline dataset.
              </div>
            ) : (
              <div className="space-y-2">
                {source.recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1 font-sans"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-600" />
                        {evt.operation}
                      </span>
                      <span className="font-mono-data text-[10px] text-slate-400">
                        {formatRelativeTime(evt.timestamp)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono-data flex justify-between">
                      <span>Records: {evt.recordsProcessed}</span>
                      <span>Duration: {evt.durationMs}ms</span>
                    </div>
                    <p className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-100 leading-snug">
                      {evt.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-slate-400 font-mono-data text-[10px] flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Last Sync: {source.lastUpdatedRelative}
          </span>
          <span>ARHA SENTINEL Data Pipeline v2.4</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
