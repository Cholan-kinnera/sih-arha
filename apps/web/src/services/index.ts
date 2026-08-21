import { config } from '../config/env.config';
import type { ISchemeService } from './interfaces/scheme.service';
import type { ICitizenService } from './interfaces/citizen.service';
import type { IDocumentService } from './interfaces/document.service';
import type { IVerificationService } from './interfaces/verification.service';
import type { IReadinessService } from './interfaces/readiness.service';

import { MockSchemeService } from './mocks/mock-scheme.service';
import { MockCitizenService } from './mocks/mock-citizen.service';
import { MockDocumentService } from './mocks/mock-document.service';
import { MockVerificationService } from './mocks/mock-verification.service';
import { MockReadinessService } from './mocks/mock-readiness.service';

class ServiceRegistry {
  public schemeService: ISchemeService;
  public citizenService: ICitizenService;
  public documentService: IDocumentService;
  public verificationService: IVerificationService;
  public readinessService: IReadinessService;

  constructor() {
    if (config.dataProvider === 'mock') {
      this.schemeService = new MockSchemeService();
      this.citizenService = new MockCitizenService();
      this.documentService = new MockDocumentService();
      this.verificationService = new MockVerificationService();
      this.readinessService = new MockReadinessService();
    } else {
      this.schemeService = new MockSchemeService();
      this.citizenService = new MockCitizenService();
      this.documentService = new MockDocumentService();
      this.verificationService = new MockVerificationService();
      this.readinessService = new MockReadinessService();
    }
  }
}

export const services = new ServiceRegistry();
