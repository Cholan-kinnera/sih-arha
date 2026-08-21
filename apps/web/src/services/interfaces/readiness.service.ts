import type { SchemeReadiness } from '../../types/readiness.types';

export interface IReadinessService {
  getReadinessSummary(citizenId: string): Promise<SchemeReadiness[]>;
  getReadinessForScheme(citizenId: string, schemeId: string): Promise<SchemeReadiness | null>;
}
