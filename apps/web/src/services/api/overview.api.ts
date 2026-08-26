import { apiClient } from './client';
import type { OverviewSummary } from '../../types/api.types';

export const overviewApi = {
  getOverviewSummary: async (): Promise<OverviewSummary> => {
    return apiClient<OverviewSummary>('/overview/summary');
  },
};
