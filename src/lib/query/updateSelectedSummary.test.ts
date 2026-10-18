import type { LinkListViewData } from '@/types/api/linkApi';
import type { Link } from '@/types/link';
import { type InfiniteData, QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it } from 'vitest';

import { updateSelectedSummary } from './updateSelectedSummary';

const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const link = (id: string): Link => ({
  id,
  title: id,
  url: 'https://example.com',
  summary: '이전 요약',
  summaryStatus: 'ready',
  createdAt: '',
  updatedAt: '',
});
const page = (...links: Link[]): LinkListViewData => ({
  content: links,
  hasNext: false,
  lastId: null,
});

describe('선택 요약 캐시 반영', () => {
  afterEach(() => client.clear());

  it('일반 목록과 무한 목록이 함께 있어도 상세와 모든 페이지를 갱신한다', async () => {
    client.setQueryData(['link', 'selected'], link('selected'));
    client.setQueryData(['links', { size: 3 }], page(link('selected'), link('other')));
    client.setQueryData(['links', 'infinite'], {
      pages: [page(link('other')), page(link('selected'))],
      pageParams: [null, 'cursor'],
    });

    await updateSelectedSummary(client, 'selected', '선택한 새 요약');

    expect(client.getQueryData<Link>(['link', 'selected'])?.summary).toBe('선택한 새 요약');
    const normal = client.getQueryData<LinkListViewData>(['links', { size: 3 }])!;
    expect(normal.content.map(item => item.summary)).toEqual(['선택한 새 요약', '이전 요약']);
    const infinite = client.getQueryData<InfiniteData<LinkListViewData>>(['links', 'infinite'])!;
    expect(infinite.pages[1].content[0].summary).toBe('선택한 새 요약');
    expect(infinite.pageParams).toEqual([null, 'cursor']);
  });

  it('저장 전에 시작한 상세 조회가 늦게 끝나도 새 요약을 덮지 않는다', async () => {
    client.setQueryData(['link', 'selected'], link('selected'));
    let resolve!: (value: Link) => void;
    const pending = client
      .fetchQuery({
        queryKey: ['link', 'selected'],
        queryFn: () =>
          new Promise<Link>(done => {
            resolve = done;
          }),
      })
      .catch(() => undefined);

    await updateSelectedSummary(client, 'selected', '선택한 새 요약');
    resolve(link('selected'));
    await pending;
    expect(client.getQueryData<Link>(['link', 'selected'])?.summary).toBe('선택한 새 요약');
  });

  it('없는 상세 데이터를 불완전한 링크 객체로 만들지 않는다', async () => {
    await updateSelectedSummary(client, 'missing', '새 요약');
    expect(client.getQueryData(['link', 'missing'])).toBeUndefined();
  });
});
