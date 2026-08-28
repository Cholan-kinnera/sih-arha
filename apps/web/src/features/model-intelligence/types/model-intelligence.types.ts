import type { DataSourceType, SeverityLevel } from '../../../types/domain.types';

export interface ModelMetadata {
  name: string;
  type: string;
  version: string;
  status: 'ACTIVE_PROTOTYPE' | 'EXPERIMENTAL' | 'DEPRECATED';
  lastEvaluated: string;
  featuresCount: number;
  outputRange: string;
  calibrationDataset: string;
  provenance: DataSourceType;
}

export interface FeatureWeightDefinition {
  key: string;
  variableName: string;
  displayName: string;
  weightPct: number;
  weightDecimal: number;
  category: 'Dynamic Meteorological' | 'Dynamic Geotechnical' | 'Static Topographical' | 'Static Spatial';
  unit: string;
  role: string;
  normalizationRule: string;
  provenance: DataSourceType;
}

export interface MLModelComparison {
  id: string;
  modelName: string;
  algorithm: string;
  status: 'ACTIVE_PROTOTYPE' | 'EVALUATION_PENDING' | 'IN_TRAINING';
  rocAuc: number | null;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  sampleCount: number | null;
  validationMethod: string;
  trainingDataset: string;
  lastEvaluated: string | null;
  provenance: DataSourceType;
}

export interface SeverityThresholdRule {
  severity: SeverityLevel;
  rangeLabel: string;
  minScore: number;
  maxScore: number;
  colorHex: string;
  iconName: string;
  operationalMeaning: string;
}

export interface ModelLimitation {
  id: string;
  title: string;
  description: string;
  category: 'Scope Boundary' | 'Empirical Basis' | 'Sensor Dependency' | 'Statutory Constraint';
}

export interface DataLineageEntry {
  sourceName: string;
  datasetTitle: string;
  dataType: string;
  spatialCoverage: string;
  updateFrequency: string;
  provenance: DataSourceType;
  status: 'CONNECTED' | 'CACHED' | 'SIMULATED';
  limitations: string;
}
