import { config } from '../config/env.config';
import type { ISchemeService } from './interfaces/scheme.service';
import type { ICitizenService } from './interfaces/citizen.service';
import { MockSchemeService } from './mocks/mock-scheme.service';
import { MockCitizenService } from './mocks/mock-citizen.service';

class ServiceRegistry {
  public schemeService: ISchemeService;
  public citizenService: ICitizenService;

  constructor() {
    if (config.dataProvider === 'mock') {
      this.schemeService = new MockSchemeService();
      this.citizenService = new MockCitizenService();
    } else {
      this.schemeService = new MockSchemeService();
      this.citizenService = new MockCitizenService();
    }
  }
}

export const services = new ServiceRegistry();
