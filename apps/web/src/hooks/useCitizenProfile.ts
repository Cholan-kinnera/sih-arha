import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../services';
import type { CitizenProfileDraft } from '../types/citizen.types';

export function useCitizenProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['citizenProfile'],
    queryFn: () => services.citizenService.getCurrentProfile(),
  });

  const saveProfileMutation = useMutation({
    mutationFn: (draft: CitizenProfileDraft) => services.citizenService.saveProfile(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizenProfile'] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    saveProfile: saveProfileMutation.mutateAsync,
    isSaving: saveProfileMutation.isPending,
  };
}
