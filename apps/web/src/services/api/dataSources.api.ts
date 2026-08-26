import { apiClient } from './client';
import type { DataSource } from '../../types/domain.types';

export const dataSourcesApi = {
  getDataSources: async (): Promise<DataSource[]> => {
    return apiClient<DataSource[]>('/data-sources');
  },
};
