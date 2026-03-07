import { deleteLink } from '@/apis/linkApi';
import type { DeleteLinkApiResponse } from '@/types/api/linkApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteLink() {
  const qc = useQueryClient();

  return useMutation<DeleteLinkApiResponse, Error, number>({
    mutationFn: deleteLink,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
