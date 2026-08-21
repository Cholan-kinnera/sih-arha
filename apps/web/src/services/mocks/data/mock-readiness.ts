import type { SchemeReadiness } from '../../../types/readiness.types';

export const MOCK_READINESS: SchemeReadiness[] = [
  {
    schemeId: 'SCHEME-SYNTH-001',
    schemeCode: 'SYNTH-SHEAS-2026',
    schemeName: 'Synthetic Higher Education Financial Assistance Scheme',
    status: 'PARTIALLY_READY',
    nextAction: 'Verify Annual Family Income Certificate to complete application readiness.',
    officialChannelName: 'Synthetic State Higher Education Portal',
    officialChannelUrl: 'https://example.gov.in/synthetic-scholarships',
    checklist: [
      { id: 'CHK-1', label: 'Age condition (17-25 years)', isFulfilled: true, category: 'ELIGIBILITY' },
      { id: 'CHK-2', label: 'Karnataka State domicile verified', isFulfilled: true, category: 'VERIFICATION', targetRoute: '/verification' },
      { id: 'CHK-3', label: 'College Bonafide Certificate verified', isFulfilled: true, category: 'DOCUMENT', targetRoute: '/documents' },
      { id: 'CHK-4', label: 'Income Certificate pending verification', isFulfilled: false, category: 'VERIFICATION', actionPrompt: 'Complete Income Certificate Verification', targetRoute: '/verification' },
    ],
  },
];
