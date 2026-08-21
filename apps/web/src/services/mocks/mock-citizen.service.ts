import type { ICitizenService } from '../interfaces/citizen.service';
import type { CitizenProfile, CitizenProfileDraft } from '../../types/citizen.types';
import { DEMO_CITIZEN_PROFILE } from './data/mock-citizens';

export class MockCitizenService implements ICitizenService {
  private currentProfile: CitizenProfile = { ...DEMO_CITIZEN_PROFILE };

  async getCurrentProfile(): Promise<CitizenProfile | null> {
    await new Promise((res) => setTimeout(res, 100));
    return this.currentProfile;
  }

  async saveProfile(draft: CitizenProfileDraft): Promise<CitizenProfile> {
    await new Promise((res) => setTimeout(res, 250));
    this.currentProfile = {
      ...draft,
      id: `CIT-${Date.now()}`,
    };
    return this.currentProfile;
  }

  async updateProfile(id: string, updates: Partial<CitizenProfileDraft>): Promise<CitizenProfile> {
    await new Promise((res) => setTimeout(res, 200));
    this.currentProfile = {
      ...this.currentProfile,
      ...updates,
      id,
    };
    return this.currentProfile;
  }
}
