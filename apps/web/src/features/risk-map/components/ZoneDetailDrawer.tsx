import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Mountain,
  Droplets,
  CloudRain,
  Radio,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Activity,
  FileText,
  MapPin,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import { RiskScoreGauge } from '../../../components/risk/RiskScoreGauge';
import { ProvenanceBadge } from '../../../components/data/ProvenanceBadge';
import { drawerVariants } from '../../../lib/motion';
import { CaineThresholdChart } from './CaineThresholdChart';
import type { Zone } from '../../../types/domain.types';
import { OVERVIEW_DEMO_DATA } from '../../overview/data/overview.demo';

export interface ZoneDetailDrawerProps {
  zone: Zone | null;
  onClose: () => void;
}

export const ZoneDetailDrawer: React.FC<ZoneDetailDrawerProps> = ({ zone, onClose }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!zone) return null;

  // Find associated alert if any
  const associatedAlert = OVERVIEW_DEMO_DATA.alerts.find((a) => a.zone_id === zone.id);
  const isAlertActive = associatedAlert && associatedAlert.status === 'ACTIVE' && !acknowledged;

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={zone.id}
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
                {zone.id}
              </span>
              <ProvenanceBadge type="SIMULATED" />
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{zone.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {zone.district}, {zone.state} · Wayanad Basin Sector
            </p>
          </div>
          <IconButton
            aria-label="Close Zone Inspector Panel"
            onClick={onClose}
            size="sm"
            className="text-slate-400 hover:text-slate-700 shrink-0"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* SCROLLABLE INTELLIGENCE BODY (Unified hierarchy, clean dividers) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {/* SECTION 2: HAZARD RISK STATUS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hazard Susceptibility Status
              </span>
              {zone.current_severity && (
                <RiskSeverityBadge
                  severity={zone.current_severity}
                  score={zone.current_risk_score}
                />
              )}
            </div>
            {zone.current_risk_score !== undefined && (
              <div className="bg-slate-50/80 p-3 rounded-[6px] border border-slate-200/80">
                <RiskScoreGauge score={zone.current_risk_score} showLabels={true} />
              </div>
            )}
          </div>

          {/* SECTION 3: DETERMINISTIC RISK DRIVERS */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Primary Physical Drivers
              </span>
              <span className="text-[10px] font-mono-data text-slate-400">Model Weight %</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>72h Cumulative Rainfall</span>
                  <span className="font-mono-data font-bold text-blue-600">35% Weight</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Terrain Slope Gradient ({zone.slope.toFixed(1)}°)</span>
                  <span className="font-mono-data font-bold text-amber-600">25% Weight</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Soil Moisture Saturation</span>
                  <span className="font-mono-data font-bold text-indigo-600">25% Weight</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[84%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Historical Landslide Buffer</span>
                  <span className="font-mono-data font-bold text-slate-600">15% Weight</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-600 h-full rounded-full w-[60%]" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PHYSICAL TELEMETRY SNAPSHOT */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Physical Telemetry Snapshot
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" /> 24h Rain
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  184.2 <span className="text-[10px] font-normal text-slate-500">mm</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-700" /> 72h Rain
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  310.5 <span className="text-[10px] font-normal text-slate-500">mm</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-indigo-600" /> Soil Saturation
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">84.1%</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-amber-600" /> Slope Angle
                </div>
                <div className="text-sm font-bold font-mono-data text-slate-900">
                  {zone.slope.toFixed(1)}°
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80 leading-relaxed font-sans">
              <span className="font-semibold text-slate-700">Elevation:</span>{' '}
              <span className="font-mono-data font-bold">{zone.elevation}m ASL</span> |{' '}
              <span className="font-semibold text-slate-700">Soil:</span> {zone.soil_type}
            </div>
          </div>

          {/* SECTION 5: THRESHOLD STABILITY ANALYSIS (Caine 1980 Curve) */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-red-600" />
                Caine Intensity-Duration Threshold
              </div>
              <span className="text-[10px] font-mono-data text-slate-400">I = 14.82·D⁻⁰·³⁹</span>
            </div>
            <div className="bg-slate-50/60 p-2 rounded-[6px] border border-slate-200/80">
              <CaineThresholdChart />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Observed rainfall intensity exceeds the empirical stability threshold for continuous durations &gt; 12 hours.
            </p>
          </div>

          {/* SECTION 6: SITUATION BRIEF (Structured Evidence Summary) */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold uppercase tracking-wider text-[11px]">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Situation Brief
            </div>
            <div className="p-3 bg-blue-50/50 rounded-[6px] border border-blue-200/80 text-xs text-slate-700 leading-relaxed">
              Precipitation volume over the preceding 72 hours reached 310.5mm, elevating pore pressure across clayey colluvium on steep 34.5° terrain. Soil saturation has reached 84.1%, crossing empirical threshold stability parameters.
              <div className="text-[10px] text-slate-400 font-mono-data pt-1">
                Generated from current telemetry & model evidence.
              </div>
            </div>
          </div>

          {/* SECTION 7: OPERATIONAL ALERT TRIAGE & SENSORS */}
          {associatedAlert && (
            <div className="pt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  {isAlertActive ? (
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>Hazard Alert: {associatedAlert.id}</span>
                </div>
                <span className="text-[10px] font-mono-data text-slate-500">
                  {associatedAlert.severity}
                </span>
              </div>

              <p className="text-slate-600 leading-snug text-[11px] bg-slate-50 p-2.5 rounded-[6px] border border-slate-200/80">
                {associatedAlert.reason}
              </p>

              {isAlertActive ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleAcknowledge}
                  className="w-full mt-1"
                >
                  Acknowledge Alert & Log Dispatch
                </Button>
              ) : (
                <div className="text-[10px] font-mono-data text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 p-2 rounded-[6px] border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Acknowledged by Operator (Audit Log Saved)
                </div>
              )}
            </div>
          )}

          {/* Telemetry Sensor Node Status */}
          <div className="pt-4 space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase font-mono-data">
              Connected Telemetry Feed Status
            </div>
            <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>IMD AWS Gauge 01</span>
              </div>
              <span className="font-mono-data text-emerald-700 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>SDMA Pore Probe A</span>
              </div>
              <span className="font-mono-data text-emerald-700 font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        {/* FOOTER: LAST SYNC & MAP NAVIGATION */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1 text-slate-400 font-mono-data text-[10px]">
            <Clock className="w-3 h-3 text-slate-400" />
            Last Sync: {zone.last_updated ?? 'Just now'}
          </span>
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
