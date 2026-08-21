export interface SourceCitation {
  id: string;
  type: string;
  title: string;
  publisher: string;
  url: string;
  documentReference?: string;
  publicationDate?: string;
}

export interface SchemeBenefit {
  type: 'DIRECT_BENEFIT_TRANSFER' | 'SUBSIDY' | 'INSURANCE_COVER' | 'LOAN' | 'SERVICE';
  description: string;
  amountMin?: number;
  amountMax?: number;
  frequency: 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  currency: string;
}

export interface RequiredDocument {
  type: string;
  name: string;
  required: boolean;
  purpose: string;
  validityPeriodMonths?: number;
  acceptableIssuers: string[];
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
  actionRequired: string;
  estimatedDays?: number;
}

export interface SchemeSummary {
  id: string;
  code: string;
  name: string;
  shortName: string;
  slug: string;
  ministry: string;
  department: string;
  category: string;
  description: string;
  objective: string;
  targetBeneficiaries: string[];
  tags: string[];
  benefits: SchemeBenefit[];
  sources: SourceCitation[];
  matchReason?: string;
}
