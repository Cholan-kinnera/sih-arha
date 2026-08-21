import type { SchemeSummary } from '../../types/scheme.types';

export interface ISchemeService {
  getSchemes(filters?: { category?: string; state?: string; query?: string }): Promise<SchemeSummary[]>;
  getSchemeById(id: string): Promise<SchemeSummary | null>;
  getSchemeBySlug(slug: string): Promise<SchemeSummary | null>;
}
