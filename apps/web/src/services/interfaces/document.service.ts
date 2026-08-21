import type { DocumentEvidence } from '../../types/document.types';

export interface IDocumentService {
  getDocuments(citizenId: string): Promise<DocumentEvidence[]>;
  getDocumentById(id: string): Promise<DocumentEvidence | null>;
  uploadDocument(documentType: string, file: File): Promise<DocumentEvidence>;
}
