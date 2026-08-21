import { useQuery } from '@tanstack/react-query';
import { services } from '../services';

export function useVerification(citizenId = 'CIT-DEMO-2026') {
  return useQuery({
    queryKey: ['verifications', citizenId],
    queryFn: () => services.verificationService.getVerifications(citizenId),
  });
}
