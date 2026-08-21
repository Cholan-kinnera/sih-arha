import type { EligibilityResult } from '../../types/eligibility.types';

export interface IEligibilityService {
  evaluateEligibility(citizenId: string, schemeId: string): Promise<EligibilityResult>;
  getEligibilityResults(citizenId: string): Promise<EligibilityResult[]>;
}
