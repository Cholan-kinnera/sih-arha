import type { IReadinessService } from '../interfaces/readiness.service';
import type { SchemeReadiness } from '../../types/readiness.types';
import { MOCK_READINESS } from './data/mock-readiness';

export class MockReadinessService implements IReadinessService {
  async getReadinessSummary(_citizenId: string): Promise<SchemeReadiness[]> {
    await new Promise((res) => setTimeout(res, 150));
    return MOCK_READINESS;
  }

  async getReadinessForScheme(_citizenId: string, schemeId: string): Promise<SchemeReadiness | null> {
    await new Promise((res) => setTimeout(res, 100));
    return MOCK_READINESS.find((r) => r.schemeId === schemeId) || null;
  }
}
