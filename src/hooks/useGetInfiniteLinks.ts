import { type LinkListParams, fetchLinks } from '@/apis/linkApi';
import type { LinkListViewData } from '@/types/api/linkApi';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

type UseGetInfiniteLinksOptions = {
  enabled?: boolean;
  size?: number;
};

const DEFAULT_PAGE_SIZE = 20;

export function useGetInfiniteLinks(
  params?: Omit<LinkListParams, 'lastId' | 'size'>,
  options?: UseGetInfiniteLinksOptions
) {
  const size = Math.max(1, options?.size ?? DEFAULT_PAGE_SIZE); // 1이상

  return useInfiniteQuery<
    LinkListViewData,
    Error,
    InfiniteData<LinkListViewData>,
    ['links', 'infinite', Omit<LinkListParams, 'lastId' | 'size'> | undefined, number], // useGetLinks와 캐시 섞이는 걸 방지하기 위해 'infinite'키를 가짐
    number | null
  >({
    queryKey: ['links', 'infinite', params, size],
    queryFn: ({ pageParam }) =>
      fetchLinks({
        ...params,
        lastId: pageParam,
        size,
      }),
    initialPageParam: null,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNext) return undefined;
      if (lastPage.lastId == null) return undefined; // lastId가 없을 경우 다음 페이지 중단 가드
      return lastPage.lastId;
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30,
  });
}
