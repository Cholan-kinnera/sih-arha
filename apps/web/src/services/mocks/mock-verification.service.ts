import type { IVerificationService } from '../interfaces/verification.service';
import type { VerificationDetail } from '../../types/verification.types';

export class MockVerificationService implements IVerificationService {
  async getVerifications(_citizenId: string): Promise<VerificationDetail[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [
      {
        documentId: 'DOC-KAR-001',
        documentType: 'DOMICILE_CERTIFICATE',
        overallStatus: 'VERIFIED',
        provider: 'MOCK_DIGILOCKER',
        verifiedAt: '2026-01-15T10:35:00Z',
        timeline: [
          { stepId: '1', label: 'Uploaded', description: 'Document uploaded by citizen.', status: 'COMPLETED', timestamp: '10:30' },
          { stepId: '2', label: 'OCR Extracted', description: 'Extracted state and district bounds.', status: 'COMPLETED', timestamp: '10:32' },
          { stepId: '3', label: 'DigiLocker Mock Verification', description: 'Verified against mock issuer registry.', status: 'COMPLETED', timestamp: '10:35' },
        ],
      },
      {
        documentId: 'DOC-KAR-002',
        documentType: 'INCOME_CERTIFICATE',
        overallStatus: 'PENDING',
        provider: 'MOCK_DIGILOCKER',
        timeline: [
          { stepId: '1', label: 'Uploaded', description: 'Document uploaded by citizen.', status: 'COMPLETED', timestamp: '14:15' },
          { stepId: '2', label: 'OCR Extracted', description: 'Extracted income ₹2.4 Lakh.', status: 'COMPLETED', timestamp: '14:17' },
          { stepId: '3', label: 'Verification Inspection', description: 'Awaiting Tahsildar issuer registry match.', status: 'IN_PROGRESS' },
        ],
      },
    ];
  }

  async getVerificationByDocumentId(documentId: string): Promise<VerificationDetail | null> {
    const all = await this.getVerifications('CIT-DEMO-2026');
    return all.find((v) => v.documentId === documentId) || null;
  }
}
