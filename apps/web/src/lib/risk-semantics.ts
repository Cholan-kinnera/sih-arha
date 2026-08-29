import type { SeverityLevel } from '../types/domain.types';
import type { SeverityVisualConfig } from '../types/ui.types';

/**
 * Prototype risk bands as specified by PRODUCT_CONSTITUTION and UI_DESIGN_SYSTEM.
 * Configurable thresholds for demonstration calibration.
 */
export const RISK_THRESHOLDS = {
  MODERATE_MIN: 0.30,
  HIGH_MIN: 0.60,
  CRITICAL_MIN: 0.80,
} as const;

export const SEVERITY_CONFIGS: Record<SeverityLevel, SeverityVisualConfig> = {
  LOW: {
    label: 'LOW',
    colorHex: '#16a34a',
    bgToken: 'var(--risk-low-bg)',
    borderToken: 'var(--risk-low-border)',
    textToken: 'var(--risk-low)',
    iconName: 'CheckCircle2',
    minScore: 0.0,
    maxScore: 0.29,
  },
  MODERATE: {
    label: 'MODERATE',
    colorHex: '#d97706',
    bgToken: 'var(--risk-moderate-bg)',
    borderToken: 'var(--risk-moderate-border)',
    textToken: 'var(--risk-moderate)',
    iconName: 'AlertCircle',
    minScore: 0.30,
    maxScore: 0.59,
  },
  HIGH: {
    label: 'HIGH',
    colorHex: '#ea580c',
    bgToken: 'var(--risk-high-bg)',
    borderToken: 'var(--risk-high-border)',
    textToken: 'var(--risk-high)',
    iconName: 'TriangleAlert',
    minScore: 0.60,
    maxScore: 0.79,
  },
  CRITICAL: {
    label: 'CRITICAL',
    colorHex: '#dc2626',
    bgToken: 'var(--risk-critical-bg)',
    borderToken: 'var(--risk-critical-border)',
    textToken: 'var(--risk-critical)',
    iconName: 'ShieldAlert',
    minScore: 0.80,
    maxScore: 1.00,
  },
};

/**
 * Derive severity category from continuous numerical risk score (0.00 - 1.00).
 */
export function getSeverityFromScore(score: number): SeverityLevel {
  const clamped = Math.max(0, Math.min(1, score));
  if (clamped >= RISK_THRESHOLDS.CRITICAL_MIN) return 'CRITICAL';
  if (clamped >= RISK_THRESHOLDS.HIGH_MIN) return 'HIGH';
  if (clamped >= RISK_THRESHOLDS.MODERATE_MIN) return 'MODERATE';
  return 'LOW';
}

/**
 * Retrieve complete visual configuration for a given severity level.
 */
export function getSeverityConfig(severity: SeverityLevel): SeverityVisualConfig {
  return SEVERITY_CONFIGS[severity] ?? SEVERITY_CONFIGS.LOW;
}

/**
 * Format score into normalized string (e.g. 0.84 or 84%).
 */
export function formatRiskScore(score: number, format: 'decimal' | 'percentage' = 'decimal'): string {
  const clamped = Math.max(0, Math.min(1, score));
  if (format === 'percentage') {
    return `${Math.round(clamped * 100)}%`;
  }
  return clamped.toFixed(2);
}
