import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { OverviewPage } from '../pages/OverviewPage';
import { RiskMapPage } from '../pages/RiskMapPage';
import { ZonesPage } from '../pages/ZonesPage';
import { AlertsPage } from '../pages/AlertsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ModelIntelligencePage } from '../pages/ModelIntelligencePage';
import { DataSourcesPage } from '../pages/DataSourcesPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'map',
        element: <RiskMapPage />,
      },
      {
        path: 'zones',
        element: <ZonesPage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'model-intelligence',
        element: <ModelIntelligencePage />,
      },
      {
        path: 'data-sources',
        element: <DataSourcesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
