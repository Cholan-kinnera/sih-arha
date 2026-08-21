import type { CitizenProfile, CitizenProfileDraft } from '../../types/citizen.types';

export interface ICitizenService {
  getCurrentProfile(): Promise<CitizenProfile | null>;
  saveProfile(profile: CitizenProfileDraft): Promise<CitizenProfile>;
  updateProfile(id: string, updates: Partial<CitizenProfileDraft>): Promise<CitizenProfile>;
}
