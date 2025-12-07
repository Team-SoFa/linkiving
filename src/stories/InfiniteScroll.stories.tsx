import InfiniteScroll, {
  type InfiniteScrollProps,
} from '@/components/basics/InfiniteScroll/InfiniteScroll';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import clsx from 'clsx';
import React from 'react';

const DEFAULT_TOTAL = 95;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_DELAY = 600; // ms

export type DemoItem = { id: number; title: string; desc: string };

const makeItems = (offset: number, size: number): DemoItem[] =>
  Array.from({ length: size }, (_, i) => {
    const id = offset + i + 1;
    return {
      id,
      title: `항목 #${id}`,
      desc: `이것은 데모 항목 ${id}의 설명입니다. 무한 스크롤 동작을 확인해 보세요.`,
    };
  });

const createMockFetch =
  (
    total = DEFAULT_TOTAL,
    pageSize = DEFAULT_PAGE_SIZE,
    delay = DEFAULT_DELAY,
    errorAtPage?: number
  ) =>
  async (page: number): Promise<{ items: DemoItem[]; hasMore: boolean }> => {
    await new Promise(r => setTimeout(r, delay));
    if (errorAtPage && page === errorAtPage) {
      throw new Error('가짜 오류: 네트워크 문제');
    }
    const start = (page - 1) * pageSize;
    const remain = Math.max(0, total - start);
    const size = Math.min(pageSize, remain);
    const items = size > 0 ? makeItems(start, size) : [];
    const hasMore = start + size < total;
    return { items, hasMore };
  };

// ===== Demo wrapper components =====

type DemoStateProps = {
  /** 전체 개수 */
  total?: number;
  /** 페이지 크기 */
  pageSize?: number;
  /** 지연(ms) */
  delay?: number;
  /** 특정 페이지에서 에러 유발 (예: 3) */
  errorAtPage?: number;
  /** container root 사용 여부 */
  useContainer?: boolean;
  /** container 높이 (useContainer=true일 때만) */
  containerHeight?: number;
} & Pick<InfiniteScrollProps, 'rootMargin' | 'threshold' | 'observe' | 'loader' | 'endMessage'>;

const DemoList: React.FC<DemoStateProps> = ({
  total = DEFAULT_TOTAL,
  pageSize = DEFAULT_PAGE_SIZE,
  delay = DEFAULT_DELAY,
  errorAtPage,
  useContainer = false,
  containerHeight = 384,
  rootMargin = '0px 0px 400px 0px',
  threshold = 0,
  observe = true,
  loader,
  endMessage,
}) => {
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<DemoItem[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const fetcher = React.useMemo(
    () => createMockFetch(total, pageSize, delay, errorAtPage),
    [total, pageSize, delay, errorAtPage]
  );

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const { items: first, hasMore } = await fetcher(1);
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
  }, [fetcher]);

  const onLoadMore = React.useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const { items: next, hasMore } = await fetcher(page);
      setItems(prev => [...prev, ...next]);
      setHasMore(hasMore);
      setPage(p => p + 1);
    } catch {
      setErrorMessage('목록을 불러오지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, page]);

  const content = (
    <InfiniteScroll
      className="w-full"
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      errorMessage={errorMessage}
      root={useContainer ? containerRef.current : null}
      rootMargin={rootMargin}
      threshold={threshold}
      observe={observe}
      loader={
        loader ?? (
          <span>
            다음 페이지 불러오는 중… <span aria-hidden>⏳</span>
          </span>
        )
      }
      endMessage={endMessage ?? <span>끝까지 보셨습니다 👋</span>}
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
  );

  if (!useContainer) return content;

  return (
    <div
      ref={containerRef}
      className={clsx('w-full overflow-y-auto rounded-2xl border p-3')}
      style={{ height: containerHeight }}
    >
      {content}
    </div>
  );
};

const meta = {
  title: 'Components/Basics/InfiniteScroll',
  component: InfiniteScroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hasMore: { control: { disable: true } },
    isLoading: { control: { disable: true } },
    errorMessage: { control: { disable: true } },
    onLoadMore: { control: { disable: true } },
    root: { control: { disable: true } },
    children: { control: { disable: true } },

    rootMargin: {
      control: 'text',
      description: 'IntersectionObserver rootMargin',
    },
    threshold: {
      control: 'number',
      description: 'IntersectionObserver threshold',
    },
    observe: {
      control: 'boolean',
      description: '관찰 토글',
    },
  },
} satisfies Meta<typeof InfiniteScroll>;

export default meta;

const demoArgTypes = {
  total: { control: 'number', description: '총 아이템 수(데모용)' },
  pageSize: { control: 'number', description: '페이지 크기(데모용)' },
  delay: { control: 'number', description: '지연(ms, 데모용)' },
  errorAtPage: { control: 'number', description: '해당 페이지에서 에러 유발(데모용)' },
  useContainer: { control: 'boolean', description: '스크롤 컨테이너 사용' },
  containerHeight: { control: 'number', description: '컨테이너 높이(px)' },
};

type Story = StoryObj; // 간단 타이핑

export const Basic: Story = {
  name: '기본(뷰포트 관찰)',
  args: {
    rootMargin: '0px 0px 400px 0px',
    threshold: 0,
    observe: true,
    total: DEFAULT_TOTAL,
    pageSize: DEFAULT_PAGE_SIZE,
    delay: DEFAULT_DELAY,
    useContainer: false,
  } as DemoStateProps,
  argTypes: demoArgTypes,
  render: (args: DemoStateProps) => <DemoList {...args} />,
};

export const WithError: Story = {
  name: '에러 발생 및 재시도',
  args: {
    rootMargin: '0px 0px 300px 0px',
    threshold: 0,
    observe: true,
    total: DEFAULT_TOTAL,
    pageSize: DEFAULT_PAGE_SIZE,
    delay: 400,
    errorAtPage: 3,
    useContainer: false,
  } as DemoStateProps,
  argTypes: demoArgTypes,
  render: (args: DemoStateProps) => <DemoList {...args} />,
};

export const InScrollableContainer: Story = {
  name: '컨테이너 관찰(스크롤 박스)',
  args: {
    rootMargin: '0px 0px 200px 0px',
    threshold: 0,
    observe: true,
    total: DEFAULT_TOTAL,
    pageSize: DEFAULT_PAGE_SIZE,
    delay: DEFAULT_DELAY,
    useContainer: true,
    containerHeight: 420,
  } as DemoStateProps,
  argTypes: demoArgTypes,
  render: (args: DemoStateProps) => <DemoList {...args} />,
};
