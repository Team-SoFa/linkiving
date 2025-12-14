import { deleteLink } from '@/apis/linkApi';
import type { DeleteLinkApiResponse } from '@/types/api/linkApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteLink() {
  const qc = useQueryClient();

  return useMutation<DeleteLinkApiResponse, Error, number>({
    mutationFn: id => deleteLink(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['links', id] });
    },
  });
}
