import type { ISchemeService } from '../interfaces/scheme.service';
import type { SchemeSummary } from '../../types/scheme.types';
import { MOCK_SCHEMES } from './data/mock-schemes';

export class MockSchemeService implements ISchemeService {
  async getSchemes(filters?: { category?: string; state?: string; query?: string }): Promise<SchemeSummary[]> {
    await new Promise((res) => setTimeout(res, 200));

    let results = [...MOCK_SCHEMES];

    if (filters?.category) {
      results = results.filter((s) => s.category.toUpperCase() === filters.category?.toUpperCase());
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    return results;
  }

  async getSchemeById(id: string): Promise<SchemeSummary | null> {
    await new Promise((res) => setTimeout(res, 150));
    return MOCK_SCHEMES.find((s) => s.id === id) || null;
  }

  async getSchemeBySlug(slug: string): Promise<SchemeSummary | null> {
    await new Promise((res) => setTimeout(res, 150));
    return MOCK_SCHEMES.find((s) => s.slug === slug) || null;
  }
}
