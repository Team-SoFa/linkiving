import { updateLinkMemo } from '@/apis/linkApi';
import type { Link } from '@/types/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLinkMemo() {
  const qc = useQueryClient();

  return useMutation<Link, Error, { id: number; memo: string }>({
    mutationFn: ({ id, memo }) => updateLinkMemo(id, memo),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['links'] });
      qc.invalidateQueries({ queryKey: ['links', variables.id] });
    },
  });
}
