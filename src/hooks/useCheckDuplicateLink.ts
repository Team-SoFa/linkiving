import { checkDuplicateLink } from '@/apis/linkApi';
import { useQuery } from '@tanstack/react-query';

export function useCheckDuplicateLink(url: string | undefined) {
  return useQuery<boolean, Error, boolean, ['duplicate-link', string | undefined]>({
    queryKey: ['duplicate-link', url],
    queryFn: () => {
      if (!url) throw new Error('url is required');
      return checkDuplicateLink(url);
    },
    enabled: Boolean(url),
  });
}
