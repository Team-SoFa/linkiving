import { updateLink } from '@/apis/linkApi';
import type { Link, UpdateLinkPayload } from '@/types/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLink() {
  const qc = useQueryClient();

  return useMutation<Link, Error, { id: number; payload: UpdateLinkPayload }>({
    mutationFn: ({ id, payload }) => updateLink(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['links', variables.id] });
    },
  });
}
