import type { VerificationDetail } from '../../types/verification.types';

export interface IVerificationService {
  getVerifications(citizenId: string): Promise<VerificationDetail[]>;
  getVerificationByDocumentId(documentId: string): Promise<VerificationDetail | null>;
}
