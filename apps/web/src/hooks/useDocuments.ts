import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../services';

export function useDocuments(citizenId = 'CIT-DEMO-2026') {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ['documents', citizenId],
    queryFn: () => services.documentService.getDocuments(citizenId),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ type, file }: { type: string; file: File }) =>
      services.documentService.uploadDocument(type, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  };
}
