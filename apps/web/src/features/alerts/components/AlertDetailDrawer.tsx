import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  Layers,
  CloudRain,
  Droplets,
  Mountain,
  FileText,
  History,
  Check,
  UserCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import { RiskScoreGauge } from '../../../components/risk/RiskScoreGauge';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { drawerVariants } from '../../../lib/motion';
import { formatRelativeTime } from '../../../lib/date-utils';
import type { AlertDetailed } from '../types/alerts.types';

export interface AlertDetailDrawerProps {
  alert: AlertDetailed | null;
  onClose: () => void;
  onOpenAcknowledgeModal: (alert: AlertDetailed) => void;
  onOpenZoneInspector?: (zoneId: string) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  onClose,
  onOpenAcknowledgeModal,
}) => {
  if (!alert) return null;

  const isActive = alert.status === 'ACTIVE';

  return (
    <AnimatePresence>
      <motion.div
        key={alert.id}
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
              <span className="text-[10px] font-mono-data font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {alert.id}
              </span>
              <ProvenanceBadge type="SIMULATED" />
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {alert.zone_name ?? alert.zone_id}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {alert.district}, {alert.state} · {alert.basin_sector}
            </p>
          </div>
          <IconButton
            aria-label="Close Alert Details"
            onClick={onClose}
            size="sm"
            className="text-slate-400 hover:text-slate-700 shrink-0"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* SCROLLABLE INTELLIGENCE BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {/* SECTION 2: OPERATIONAL STATUS & IMMEDIATE TRIAGE ACTION */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hazard Alert Status
              </span>
              <RiskSeverityBadge
                severity={alert.severity}
                score={alert.risk_score}
              />
            </div>

            {isActive ? (
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-[6px] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-700">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Unacknowledged Active Alert</span>
                  </div>
                  <span className="text-[10px] font-mono-data text-red-600">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onOpenAcknowledgeModal(alert)}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Acknowledge & Record Dispatch Action
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-[6px] space-y-1 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Acknowledged by Duty Operator</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold">Operator:</span> {alert.acknowledged_by}
                </div>
                {alert.dispatch_notes && (
                  <div className="text-[11px] text-slate-600 pt-0.5 bg-white p-2 rounded border border-emerald-100">
                    <span className="font-semibold text-slate-700">Dispatch Notes:</span> {alert.dispatch_notes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: TRIGGER CONDITION & BREACH EVIDENCE */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Threshold Breach Evidence
            </span>

            <div className="bg-slate-50 p-3 rounded-[6px] border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Trigger Metric:</span>
                <span className="font-bold text-slate-900">{alert.trigger_metric}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Observed Value:</span>
                <span className="font-mono-data font-bold text-red-600">{alert.observed_value_text}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Configured Limit:</span>
                <span className="font-mono-data text-slate-600">{alert.trigger_threshold_text}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-snug bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80">
              {alert.reason}
            </p>
          </div>

          {/* SECTION 4: RISK SCORE GAUGE */}
          <div className="pt-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Continuous Risk Index
            </span>
            <div className="bg-slate-50/80 p-3 rounded-[6px] border border-slate-200/80">
              <RiskScoreGauge score={alert.risk_score} showLabels={true} />
            </div>
          </div>

          {/* SECTION 5: PHYSICAL TELEMETRY SNAPSHOT */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Associated Sector Telemetry
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" /> 24h Rain
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  {alert.rain_24h_mm.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">mm</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-700" /> 72h Rain
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  {alert.rain_72h_mm.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">mm</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-indigo-600" /> Soil Saturation
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  {alert.soil_moisture_pct.toFixed(1)}%
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-amber-600" /> Slope Angle
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  {alert.slope.toFixed(1)}°
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
              <span className="font-semibold text-slate-700">Elevation:</span>{' '}
              <span className="font-mono-data font-bold">{alert.elevation}m ASL</span> |{' '}
              <span className="font-semibold text-slate-700">Soil:</span> {alert.soil_type}
            </div>
          </div>

          {/* SECTION 6: SITUATION BRIEF */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold uppercase tracking-wider text-[11px]">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Situation Brief
            </div>
            <div className="p-3 bg-blue-50/50 rounded-[6px] border border-blue-200/80 text-xs text-slate-700 leading-relaxed">
              Hazard condition generated from deterministic telemetry correlation. Continuous precipitation index over 72h reached {alert.rain_72h_mm}mm, exceeding slope pore pressure thresholds on {alert.slope.toFixed(1)}° terrain.
              <div className="text-[10px] text-slate-400 font-mono-data pt-1">
                Grounded in empirical IMD & GSI hazard guidelines.
              </div>
            </div>
          </div>

          {/* SECTION 7: CHRONOLOGICAL AUDIT TRAIL */}
          <div className="pt-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <History className="w-3.5 h-3.5 text-slate-600" />
              Operational Audit Trail
            </div>

            <div className="space-y-2">
              {alert.audit_history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-1 font-sans"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-blue-600" />
                      {entry.action}
                    </span>
                    <span className="font-mono-data text-[10px] text-slate-400">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-data">
                    By: {entry.operator}
                  </div>
                  {entry.notes && (
                    <p className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-100 leading-snug">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER: SPATIAL & ZONE NAVIGATION */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <Link
            to="/zones"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-[4px] shadow-2xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Zone Directory</span>
          </Link>

          <Link
            to="/map"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-[4px] shadow-2xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View on Risk Map</span>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
