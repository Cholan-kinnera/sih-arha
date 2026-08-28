import React, { useState } from 'react';
import { ModelStatusHeader } from '../features/model-intelligence/components/ModelStatusHeader';
import { RiskFormulaCard } from '../features/model-intelligence/components/RiskFormulaCard';
import { FeatureWeightsCard } from '../features/model-intelligence/components/FeatureWeightsCard';
import { SeverityThresholdsCard } from '../features/model-intelligence/components/SeverityThresholdsCard';
import { ModelComparisonTable } from '../features/model-intelligence/components/ModelComparisonTable';
import { ModelDataLineageCard } from '../features/model-intelligence/components/ModelDataLineageCard';
import { ModelLimitationsCard } from '../features/model-intelligence/components/ModelLimitationsCard';
import { ModelReproducibilityCard } from '../features/model-intelligence/components/ModelReproducibilityCard';
import { ModelIntelligenceSkeleton } from '../features/model-intelligence/components/ModelIntelligenceSkeleton';
import {
  MODEL_METADATA,
  FEATURE_WEIGHTS_DATA,
  ML_MODEL_COMPARISON_DATA,
  DATA_LINEAGE_DATA,
  MODEL_LIMITATIONS_DATA,
} from '../features/model-intelligence/data/model-intelligence.demo';

export const ModelIntelligencePage: React.FC = () => {
  const [isLoading] = useState(false);

  if (isLoading) {
    return <ModelIntelligenceSkeleton />;
  }

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Header & Engine Status Overview */}
      <ModelStatusHeader
        metadata={MODEL_METADATA}
        lastUpdatedTimestamp={new Date().toISOString()}
      />

      {/* 2. Deterministic Risk Formula Decomposition */}
      <RiskFormulaCard />

      {/* 3. Physical Feature Weight Breakdown & Parameter Dictionary */}
      <FeatureWeightsCard features={FEATURE_WEIGHTS_DATA} />

      {/* 4. Categorical Severity Thresholds Mapping */}
      <SeverityThresholdsCard />

      {/* 5. ML Benchmark Comparison Matrix */}
      <ModelComparisonTable models={ML_MODEL_COMPARISON_DATA} />

      {/* 6. Data Lineage, Ingestion Feeds & Sensor Constraints */}
      <ModelDataLineageCard lineageEntries={DATA_LINEAGE_DATA} />

      {/* 7. Methodological Assumptions & Operational Boundaries */}
      <ModelLimitationsCard limitations={MODEL_LIMITATIONS_DATA} />

      {/* 8. Scientific Reproducibility & Schema Versioning */}
      <ModelReproducibilityCard />
    </div>
  );
};
