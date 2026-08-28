import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, X, Check, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { RiskSeverityBadge } from '../../../components/risk/RiskSeverityBadge';
import { backdropVariants } from '../../../lib/motion';
import type { AlertDetailed } from '../types/alerts.types';

export interface AlertAcknowledgeModalProps {
  alert: AlertDetailed | null;
  onClose: () => void;
  onConfirm: (alertId: string, notes?: string) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const AlertAcknowledgeModal: React.FC<AlertAcknowledgeModalProps> = ({
  alert,
  onClose,
  onConfirm,
  isSubmitting = false,
  error = null,
}) => {
  const [dispatchNotes, setDispatchNotes] = useState('');

  if (!alert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    onConfirm(alert.id, dispatchNotes.trim() || undefined);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.14 } }}
          className="relative w-full max-w-lg bg-white rounded-[8px] border border-slate-200 shadow-2xl overflow-hidden z-10 font-sans select-none"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/90 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  Acknowledge Operational Hazard Alert
                </h3>
                <p className="text-xs text-slate-500">
                  Record official operator triage and audit confirmation log.
                </p>
              </div>
            </div>
            <IconButton
              aria-label="Cancel Acknowledgment Dialog"
              onClick={onClose}
              size="sm"
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-700 shrink-0"
            >
              <X className="w-4 h-4" />
            </IconButton>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Error Banner if submit failed */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[6px] p-2.5 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Alert Summary Box */}
            <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900">
                  {alert.id} · {alert.zone_name ?? alert.zone_id}
                </div>
                <RiskSeverityBadge
                  severity={alert.severity}
                  score={alert.risk_score}
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {alert.reason}
              </p>
            </div>

            {/* Operator Dispatch Notes Input */}
            <div className="space-y-1.5 text-xs">
              <label htmlFor="dispatch-notes" className="font-semibold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Operator Dispatch & Triage Notes (Optional):</span>
              </label>
              <textarea
                id="dispatch-notes"
                rows={3}
                value={dispatchNotes}
                disabled={isSubmitting}
                onChange={(e) => setDispatchNotes(e.target.value)}
                placeholder="e.g. Field patrol alerted for drainage culvert monitoring. Advisory forwarded to local disaster management control room."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors resize-none font-sans disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-400 font-mono-data">
                Logged under: Operator ID: OP-412 (Duty Officer)
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              >
                {isSubmitting ? 'Recording Acknowledgment...' : 'Confirm Acknowledgment & Log Audit'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
