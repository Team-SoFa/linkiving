import { updateLinkMemo } from '@/apis/linkApi';
import type { EntityId } from '@/types/id';
import type { Link } from '@/types/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLinkMemo() {
  const qc = useQueryClient();

  return useMutation<Link, Error, { id: EntityId; memo: string }>({
    mutationFn: ({ id, memo }) => updateLinkMemo(id, memo),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['link', variables.id] });
    },
  });
}
