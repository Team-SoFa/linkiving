import { deleteLink } from '@/apis/linkApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteLink() {
  const qc = useQueryClient();

  return useMutation<
    { success: boolean; status: string; message: string; data: string; timestamp: string },
    Error,
    number
  >({
    mutationFn: id => deleteLink(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['links', id] });
    },
  });
}
