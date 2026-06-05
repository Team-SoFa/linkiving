import { deleteLink } from '@/apis/linkApi';
import type { DeleteLinkApiResponse } from '@/types/api/linkApi';
import type { EntityId } from '@/types/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteLink() {
  const qc = useQueryClient();

  return useMutation<DeleteLinkApiResponse, Error, EntityId>({
    mutationFn: deleteLink,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
