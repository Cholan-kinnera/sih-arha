import type { DocumentEvidence } from '../../../types/document.types';

export const MOCK_DOCUMENTS: DocumentEvidence[] = [
  {
    id: 'DOC-KAR-001',
    documentType: 'DOMICILE_CERTIFICATE',
    documentName: 'Karnataka Domicile Certificate',
    fileName: 'domicile_certificate_arjun.pdf',
    uploadedAt: '2026-01-15T10:30:00Z',
    status: 'VERIFIED',
    issuer: 'Revenue Department, Govt of Karnataka',
    validUntil: '2030-12-31',
    isDemoDocument: true,
    extractedFields: [
      { fieldName: 'state', fieldLabel: 'State of Residence', extractedValue: 'Karnataka', confidenceScore: 0.98 },
      { fieldName: 'district', fieldLabel: 'District', extractedValue: 'Bengaluru Urban', confidenceScore: 0.95 },
      { fieldName: 'citizenName', fieldLabel: 'Applicant Name', extractedValue: 'Arjun Kumar', confidenceScore: 0.99 },
    ],
  },
  {
    id: 'DOC-KAR-002',
    documentType: 'INCOME_CERTIFICATE',
    documentName: 'Annual Family Income Certificate',
    fileName: 'income_cert_2025_26.pdf',
    uploadedAt: '2026-02-01T14:15:00Z',
    status: 'PROCESSING',
    issuer: 'Tahsildar Office, Bengaluru Urban',
    validUntil: '2026-03-31',
    isDemoDocument: true,
    extractedFields: [
      { fieldName: 'annualFamilyIncome', fieldLabel: 'Annual Family Income (INR)', extractedValue: 240000, confidenceScore: 0.94 },
      { fieldName: 'financialYear', fieldLabel: 'Financial Year', extractedValue: '2025-2026', confidenceScore: 0.97 },
    ],
  },
  {
    id: 'DOC-KAR-003',
    documentType: 'COLLEGE_BONAFIDE_CERTIFICATE',
    documentName: 'College Bonafide Student Certificate',
    fileName: 'bonafide_degree_college.pdf',
    uploadedAt: '2026-02-10T09:00:00Z',
    status: 'VERIFIED',
    issuer: 'Principal, Govt First Grade College',
    validUntil: '2026-06-30',
    isDemoDocument: true,
    extractedFields: [
      { fieldName: 'enrollmentType', fieldLabel: 'Enrollment Type', extractedValue: 'FULL_TIME_UNDERGRADUATE', confidenceScore: 0.96 },
      { fieldName: 'degree', fieldLabel: 'Degree Program', extractedValue: 'Bachelor of Science (B.Sc)', confidenceScore: 0.98 },
    ],
  },
];
