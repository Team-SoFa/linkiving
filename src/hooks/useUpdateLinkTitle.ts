import { updateLinkTitle } from '@/apis/linkApi';
import type { Link } from '@/types/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLinkTitle() {
  const qc = useQueryClient();

  return useMutation<Link, Error, { id: number; title: string }>({
    mutationFn: ({ id, title }) => updateLinkTitle(id, title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
