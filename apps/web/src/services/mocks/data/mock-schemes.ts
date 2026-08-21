import type { SchemeSummary } from '../../../types/scheme.types';

export const MOCK_SCHEMES: SchemeSummary[] = [
  {
    id: 'SCHEME-SYNTH-001',
    code: 'SYNTH-SHEAS-2026',
    name: 'Synthetic Higher Education Financial Assistance Scheme',
    shortName: 'SHEFAS',
    slug: 'synthetic-higher-education-assistance',
    ministry: 'Ministry of Synthetic Welfare',
    department: 'Department of Higher Education',
    category: 'SCHOLARSHIP',
    description: 'A model scheme providing financial assistance grants to undergraduate students from low-income households.',
    objective: 'To support meritorious post-secondary students with annual tuition and education grants.',
    targetBeneficiaries: ['Undergraduate Students', 'Low-Income Households'],
    tags: ['education', 'scholarship', 'higher-education'],
    matchReason: 'Matches your age (21), student status, and state residence (Karnataka).',
    benefits: [
      {
        type: 'DIRECT_BENEFIT_TRANSFER',
        description: 'Annual education grant deposited directly to bank account.',
        amountMin: 40000,
        amountMax: 40000,
        frequency: 'ANNUAL',
        currency: 'INR',
      },
    ],
    sources: [
      {
        id: 'SRC-SYNTH-001',
        type: 'GAZETTE_NOTIFICATION',
        title: 'Synthetic Education Guidelines No. 2026/SYNTH-01',
        publisher: 'Department of Higher Education',
        url: 'https://example.gov.in/synthetic-guidelines-2026.pdf',
        publicationDate: '2025-12-01',
      },
    ],
  },
  {
    id: 'SCHEME-SYNTH-002',
    code: 'SYNTH-SKILL-2026',
    name: 'Synthetic Skill India Youth Training Grant',
    shortName: 'SSI-YTG',
    slug: 'synthetic-skill-india-training',
    ministry: 'Ministry of Skill Development',
    department: 'National Skill Mission',
    category: 'EDUCATION',
    description: 'Skill development stipends and placement assistance for youth pursuing technical vocational courses.',
    objective: 'To empower young citizens with industry-aligned digital and technical skills.',
    targetBeneficiaries: ['Youth (Ages 18-28)', 'Technical Students'],
    tags: ['skill', 'training', 'vocational'],
    matchReason: 'Matches age (21) and youth category.',
    benefits: [
      {
        type: 'SUBSIDY',
        description: 'Free technical training course + ₹3,000 monthly stipend.',
        amountMin: 3000,
        amountMax: 15000,
        frequency: 'MONTHLY',
        currency: 'INR',
      },
    ],
    sources: [
      {
        id: 'SRC-SYNTH-002',
        type: 'OFFICIAL_PORTAL',
        title: 'Skill Mission Portal Guidelines',
        publisher: 'Ministry of Skill Development',
        url: 'https://example.gov.in/skill-mission',
      },
    ],
  },
];
