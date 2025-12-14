import { type LinkListParams, fetchLinks } from '@/apis/linkApi';
import type { LinkListApiData } from '@/types/api/linkApi';
import { useQuery } from '@tanstack/react-query';

export function useGetLinks(params?: LinkListParams) {
  return useQuery<LinkListApiData, Error, LinkListApiData, ['links', LinkListParams | undefined]>({
    queryKey: ['links', params],
    queryFn: () => fetchLinks(params),
  });
}
