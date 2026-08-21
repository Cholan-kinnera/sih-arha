export const config = {
  dataProvider: (import.meta.env.VITE_DATA_PROVIDER as 'mock' | 'api') || 'mock',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  appName: 'Citizen Benefits Intelligence Platform',
  appVersion: '0.1.0',
};
