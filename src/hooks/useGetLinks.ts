import { type LinkListParams, fetchLinks } from '@/apis/linkApi';
import type { Link, PageResponse } from '@/types/link';
import { useQuery } from '@tanstack/react-query';

export function useGetLinks(params?: LinkListParams) {
  return useQuery<
    PageResponse<Link>,
    Error,
    PageResponse<Link>,
    ['links', LinkListParams | undefined]
  >({
    queryKey: ['links', params],
    queryFn: () => fetchLinks(params),
  });
}
