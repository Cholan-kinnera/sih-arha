export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'EXTRACTED' | 'VERIFIED' | 'EXPIRED' | 'CONFLICTED';

export interface ExtractedField {
  fieldName: string;
  fieldLabel: string;
  extractedValue: string | number;
  confidenceScore: number; // 0.0 to 1.0
}

export interface DocumentEvidence {
  id: string;
  documentType: string;
  documentName: string;
  fileName: string;
  uploadedAt: string;
  status: DocumentStatus;
  extractedFields: ExtractedField[];
  issuer?: string;
  validUntil?: string;
  isDemoDocument: boolean;
}
