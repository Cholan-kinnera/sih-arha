import { useQuery } from '@tanstack/react-query';
import { services } from '../services';

export function useSchemes(filters?: { category?: string; query?: string }) {
  return useQuery({
    queryKey: ['schemes', filters],
    queryFn: () => services.schemeService.getSchemes(filters),
  });
}

export function useSchemeDetail(id?: string) {
  return useQuery({
    queryKey: ['scheme', id],
    queryFn: () => (id ? services.schemeService.getSchemeById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}
