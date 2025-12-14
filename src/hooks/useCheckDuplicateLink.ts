import { checkDuplicateLink } from '@/apis/linkApi';
import { useQuery } from '@tanstack/react-query';

type DuplicateResult = { exists: boolean; linkId?: number };

export function useCheckDuplicateLink(url: string | undefined) {
  return useQuery<DuplicateResult, Error, DuplicateResult, ['duplicate-link', string | undefined]>({
    queryKey: ['duplicate-link', url],
    queryFn: () => {
      if (!url) throw new Error('url is required');
      return checkDuplicateLink(url);
    },
    enabled: Boolean(url),
  });
}
