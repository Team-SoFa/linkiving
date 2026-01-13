import { type LinkListParams, fetchLinks } from '@/apis/linkApi';
import type { LinkListViewData } from '@/types/api/linkApi';
import { useQuery } from '@tanstack/react-query';

type UseGetLinksOptions = {
  enabled?: boolean;
};

export function useGetLinks(params?: LinkListParams, options?: UseGetLinksOptions) {
  return useQuery<LinkListViewData, Error, LinkListViewData, ['links', LinkListParams | undefined]>(
    {
      queryKey: ['links', params],
      queryFn: () => fetchLinks(params),
      enabled: options?.enabled ?? true,
    }
  );
}
