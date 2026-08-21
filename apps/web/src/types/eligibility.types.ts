export type EvaluationState = 
  | 'ELIGIBLE' 
  | 'NOT_ELIGIBLE' 
  | 'POTENTIALLY_ELIGIBLE' 
  | 'INSUFFICIENT_INFORMATION';

export type RuleStatus = 'PASSED' | 'FAILED' | 'MISSING_EVIDENCE' | 'MISSING_ATTRIBUTE';

export interface EvaluatedRule {
  ruleId: string;
  name: string;
  sourceId: string;
  citation: string;
  attributePath: string;
  operator: string;
  expectedValue: any;
  actualValue: any;
  status: RuleStatus;
  evidenceRequired?: string;
  successMessage?: string;
  failureMessage?: string;
}

export interface EligibilityResult {
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  overallState: EvaluationState;
  evaluatedAt: string;
  rulesEvaluated: EvaluatedRule[];
  summaryMessage: string;
  missingAttributes: string[];
  requiredEvidenceMissing: string[];
}
