export type ReadinessStatus = 'READY' | 'PARTIALLY_READY' | 'NOT_READY';

export interface ReadinessChecklistItem {
  id: string;
  label: string;
  isFulfilled: boolean;
  category: 'ELIGIBILITY' | 'DOCUMENT' | 'VERIFICATION' | 'APPLICATION_CHANNEL';
  actionPrompt?: string;
  targetRoute?: string;
}

export interface SchemeReadiness {
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  status: ReadinessStatus;
  checklist: ReadinessChecklistItem[];
  nextAction: string;
  officialChannelName: string;
  officialChannelUrl?: string;
}
