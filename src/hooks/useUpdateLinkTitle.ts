import { updateLinkTitle } from '@/apis/linkApi';
import type { EntityId } from '@/types/id';
import type { Link } from '@/types/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLinkTitle() {
  const qc = useQueryClient();

  return useMutation<Link, Error, { id: EntityId; title: string }>({
    mutationFn: ({ id, title }) => updateLinkTitle(id, title),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['link', variables.id] });
    },
  });
}
