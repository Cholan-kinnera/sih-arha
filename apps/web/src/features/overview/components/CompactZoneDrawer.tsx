import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, Mountain, Layers, Droplets } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import { RiskScoreGauge } from '../../../components/risk/RiskScoreGauge';
import { drawerVariants } from '../../../lib/motion';
import type { Zone } from '../../../types/domain.types';

export interface CompactZoneDrawerProps {
  zone: Zone | null;
  onClose: () => void;
  onViewDetails?: (zoneId: string) => void;
}

export const CompactZoneDrawer: React.FC<CompactZoneDrawerProps> = ({
  zone,
  onClose,
  onViewDetails,
}) => {
  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          key={zone.id}
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-3 right-3 z-30 w-80 sm:w-96"
        >
          <Card className="bg-white/95 backdrop-blur-md border-slate-300 shadow-lg p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-mono-data font-semibold text-slate-400 uppercase">
                  {zone.id} · {zone.district}, {zone.state}
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{zone.name}</h3>
              </div>
              <IconButton
                aria-label="Close Zone Inspector"
                onClick={onClose}
                size="sm"
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Severity & Score Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Susceptibility Tier</span>
                {zone.current_severity && (
                  <RiskSeverityBadge
                    severity={zone.current_severity}
                    score={zone.current_risk_score}
                  />
                )}
              </div>
              {zone.current_risk_score !== undefined && (
                <RiskScoreGauge score={zone.current_risk_score} showLabels={false} />
              )}
            </div>

            {/* Topographic & Geotechnical Attributes */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-[6px] border border-slate-200 text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Mountain className="w-3 h-3 text-slate-500" /> Slope
                </div>
                <div className="text-xs font-bold font-mono-data text-slate-900 mt-0.5">
                  {zone.slope.toFixed(1)}°
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Layers className="w-3 h-3 text-slate-500" /> Elevation
                </div>
                <div className="text-xs font-bold font-mono-data text-slate-900 mt-0.5">
                  {zone.elevation}m
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-slate-500" /> Soil Sat.
                </div>
                <div className="text-xs font-bold font-mono-data text-slate-900 mt-0.5">
                  High
                </div>
              </div>
            </div>

            {/* Geotechnical Context Note */}
            <div className="text-xs text-slate-600 bg-white p-2 rounded-[4px] border border-slate-100 leading-relaxed">
              <span className="font-semibold text-slate-700">Soil Taxonomy:</span> {zone.soil_type}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono-data text-slate-400">
                Updated {zone.last_updated ?? 'recently'}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onViewDetails?.(zone.id)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Zone Details
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
