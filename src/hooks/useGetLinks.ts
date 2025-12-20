import { type LinkListParams, fetchLinks } from '@/apis/linkApi';
import type { LinkListViewData } from '@/types/api/linkApi';
import { useQuery } from '@tanstack/react-query';

export function useGetLinks(params?: LinkListParams) {
  return useQuery<LinkListViewData, Error, LinkListViewData, ['links', LinkListParams | undefined]>(
    {
      queryKey: ['links', params],
      queryFn: () => fetchLinks(params),
    }
  );
}
