export type VerificationStepStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED' | 'EXPIRED';

export interface VerificationTimelineStep {
  stepId: string;
  label: string;
  description: string;
  status: VerificationStepStatus;
  timestamp?: string;
}

export interface VerificationDetail {
  documentId: string;
  documentType: string;
  overallStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'RE_VERIFICATION_REQUIRED';
  provider: 'MOCK_DIGILOCKER' | 'MANUAL_INSPECTION' | 'ISSUER_API';
  verifiedAt?: string;
  expiresAt?: string;
  timeline: VerificationTimelineStep[];
}
