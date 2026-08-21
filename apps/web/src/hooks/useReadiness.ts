import { useQuery } from '@tanstack/react-query';
import { services } from '../services';

export function useReadiness(citizenId = 'CIT-DEMO-2026') {
  return useQuery({
    queryKey: ['readiness', citizenId],
    queryFn: () => services.readinessService.getReadinessSummary(citizenId),
  });
}
