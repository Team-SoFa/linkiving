'use client';

// 프로젝트 구조에 맞춰 경로를 조정하세요.
// 예) '@/components/InfiniteScroll/InfiniteScroll' 또는 '@/features/common/InfiniteScroll'
import InfiniteScroll from '@/components/InfiniteScroll/InfiniteScroll';
import clsx from 'clsx';
import React from 'react';

/**
 * 데모용 페이징 가짜 API
 */
const PAGE_SIZE = 20;
const TOTAL_COUNT = 95; // 총 아이템 수(예시)

export type DemoItem = { id: number; title: string; desc: string };

function makeItems(offset: number, size: number): DemoItem[] {
  return Array.from({ length: size }, (_, i) => {
    const id = offset + i + 1;
    return {
      id,
      title: `항목 #${id}`,
      desc: `이것은 데모 항목 ${id}의 설명입니다. 무한 스크롤 동작을 확인해 보세요.`,
    };
  });
}

async function mockFetch(page: number): Promise<{ items: DemoItem[]; hasMore: boolean }> {
  // 네트워크 지연 시뮬레이션
  await new Promise(r => setTimeout(r, 600));
  const start = (page - 1) * PAGE_SIZE;
  const remain = Math.max(0, TOTAL_COUNT - start);
  const size = Math.min(PAGE_SIZE, remain);
  const items = size > 0 ? makeItems(start, size) : [];
  const hasMore = start + size < TOTAL_COUNT;
  return { items, hasMore };
}

/**
 * /demo/infinite 페이지
 * - 클라이언트 컴포넌트에서 InfiniteScroll을 사용해 페이징 로딩 예시를 보여줍니다.
 */
const DemoInfinitePage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<DemoItem[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // 최초 페이지 로드
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const { items: first, hasMore } = await mockFetch(1);
        if (!mounted) return;
        setItems(first);
        setHasMore(hasMore);
        setPage(2);
      } catch {
        setErrorMessage('초기 데이터를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onLoadMore = React.useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const { items: next, hasMore } = await mockFetch(page);
      setItems(prev => [...prev, ...next]);
      setHasMore(hasMore);
      setPage(p => p + 1);
    } catch {
      setErrorMessage('목록을 불러오지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const reset = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setErrorMessage(null);
    // 초기 로드 재트리거
    (async () => {
      try {
        setIsLoading(true);
        const { items: first, hasMore } = await mockFetch(1);
        setItems(first);
        setHasMore(hasMore);
        setPage(2);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">InfiniteScroll 데모</h1>
        <p className="text-sm text-gray-500">
          스크롤 하단으로 이동하면 다음 페이지가 자동으로 로드됩니다. (총 {TOTAL_COUNT}개)
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={reset}
            className={clsx(
              'rounded-2xl border px-3 py-1.5 text-sm',
              'hover:bg-gray-50 active:opacity-90'
            )}
          >
            데이터 초기화
          </button>
        </div>
      </header>

      <InfiniteScroll
        className="w-full"
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        errorMessage={errorMessage}
        root={null}
        rootMargin="0px 0px 400px 0px"
        threshold={0}
        loader={<span>다음 페이지 불러오는 중…</span>}
        endMessage={<span>끝까지 보셨어요 👋</span>}
        errorSlot={msg => (
          <div className="flex items-center gap-2 text-red-500">
            <span>⚠️</span>
            <span>{msg}</span>
            <button type="button" onClick={() => onLoadMore()} className="underline">
              다시 시도
            </button>
          </div>
        )}
      >
        <ul className="grid gap-3">
          {items.map(it => (
            <li key={it.id} className="rounded-2xl border p-4">
              <div className="text-base font-medium">{it.title}</div>
              <div className="text-sm text-gray-500">{it.desc}</div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </main>
  );
};

export default DemoInfinitePage;
