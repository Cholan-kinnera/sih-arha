import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { AppLayout } from '../components/layout/AppLayout';
import { OnboardingPage } from '../pages/OnboardingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DiscoveryPage } from '../pages/DiscoveryPage';
import {
  SchemeDetailPage,
  EligibilityPage,
  DocumentsPage,
  VerificationPage,
  ReadinessPage,
} from '../pages/Placeholders';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/discover', element: <DiscoveryPage /> },
      { path: '/schemes/:schemeId', element: <SchemeDetailPage /> },
      { path: '/eligibility/:schemeId', element: <EligibilityPage /> },
      { path: '/documents', element: <DocumentsPage /> },
      { path: '/verification', element: <VerificationPage /> },
      { path: '/readiness', element: <ReadinessPage /> },
    ],
  },
]);
