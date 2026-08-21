export interface CitizenProfile {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  state: string;
  district: string;
  occupation: string;
  annualFamilyIncome: number;
  casteCategory: string;
  landOwnershipHectares: number;
  familySize: number;
  isStudent: boolean;
  educationLevel: string;
}

export type CitizenProfileDraft = Omit<CitizenProfile, 'id'>;
