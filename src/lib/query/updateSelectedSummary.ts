import type { LinkListViewData } from '@/types/api/linkApi';
import type { EntityId } from '@/types/id';
import type { Link } from '@/types/link';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

export async function updateSelectedSummary(client: QueryClient, id: EntityId, summary: string) {
  // 저장 전에 시작된 조회가 늦게 완료되어 선택한 요약을 덮지 않게 한다.
  await Promise.all([
    client.cancelQueries({ queryKey: ['link', id] }),
    client.cancelQueries({ queryKey: ['links'] }),
  ]);

  const updateLink = (link: Link): Link =>
    link.id === id
      ? {
          ...link,
          summary,
          summaryStatus: 'ready',
          summaryErrorMessage: undefined,
          summaryProgress: undefined,
        }
      : link;
  const updatePage = (page: LinkListViewData): LinkListViewData => ({
    ...page,
    content: page.content.map(updateLink),
  });

  client.setQueryData<Link>(['link', id], previous => (previous ? updateLink(previous) : previous));
  client.setQueriesData<LinkListViewData | InfiniteData<LinkListViewData>>(
    { queryKey: ['links'] },
    previous => {
      if (!previous) return previous;
      return 'pages' in previous
        ? { ...previous, pages: previous.pages.map(updatePage) }
        : updatePage(previous);
    }
  );
}
