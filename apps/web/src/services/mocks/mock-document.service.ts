import type { IDocumentService } from '../interfaces/document.service';
import type { DocumentEvidence } from '../../types/document.types';
import { MOCK_DOCUMENTS } from './data/mock-documents';

export class MockDocumentService implements IDocumentService {
  private documents: DocumentEvidence[] = [...MOCK_DOCUMENTS];

  async getDocuments(_citizenId: string): Promise<DocumentEvidence[]> {
    await new Promise((res) => setTimeout(res, 150));
    return this.documents;
  }

  async getDocumentById(id: string): Promise<DocumentEvidence | null> {
    await new Promise((res) => setTimeout(res, 100));
    return this.documents.find((d) => d.id === id) || null;
  }

  async uploadDocument(documentType: string, file: File): Promise<DocumentEvidence> {
    await new Promise((res) => setTimeout(res, 400));
    const newDoc: DocumentEvidence = {
      id: `DOC-DEMO-${Date.now()}`,
      documentType,
      documentName: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: 'PROCESSING',
      isDemoDocument: true,
      extractedFields: [
        { fieldName: 'fileName', fieldLabel: 'Uploaded File', extractedValue: file.name, confidenceScore: 0.99 },
      ],
    };
    this.documents.push(newDoc);
    return newDoc;
  }
}
