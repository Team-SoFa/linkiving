import { createLink } from '@/apis/linkApi';
import type { CreateLinkPayload, Link } from '@/types/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePostLinks() {
  const qc = useQueryClient();

  return useMutation<Link, Error, CreateLinkPayload>({
    mutationFn: createLink,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
