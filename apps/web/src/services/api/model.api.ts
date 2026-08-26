import { apiClient } from './client';
import type { ModelMetadata } from '../../types/domain.types';

export const modelApi = {
  getModelMetadata: async (): Promise<ModelMetadata> => {
    return apiClient<ModelMetadata>('/model/metadata');
  },
};
