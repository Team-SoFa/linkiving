import InfiniteScroll, {
  type InfiniteScrollProps,
} from '@/components/basics/InfiniteScroll/InfiniteScroll';
import type { Meta, StoryObj } from '@storybook/nextjs';
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
      desc: `이것은 데모 항목 ${id}의 설명입니다.`,
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

// ===== Demo =====

type DemoStateProps = {
  total?: number;
  pageSize?: number;
  delay?: number;
  errorAtPage?: number;
  useContainer?: boolean;
  containerHeight?: number;
} & Pick<InfiniteScrollProps<DemoItem>, 'loader' | 'endMessage'>;

const DemoList: React.FC<DemoStateProps> = ({
  total = DEFAULT_TOTAL,
  pageSize = DEFAULT_PAGE_SIZE,
  delay = DEFAULT_DELAY,
  errorAtPage,
  useContainer = false,
  containerHeight = 400,
  loader,
  endMessage,
}) => {
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<DemoItem[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetcher = React.useMemo(
    () => createMockFetch(total, pageSize, delay, errorAtPage),
    [total, pageSize, delay, errorAtPage]
  );

  // 초기 로드
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
        setErrorMessage('초기 데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetcher]);

  // 다음 페이지 로드
  const onLoadMore = React.useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);

      const { items: next, hasMore } = await fetcher(page);

      setItems(prev => [...prev, ...next]);
      setHasMore(hasMore);
      setPage(p => p + 1);
    } catch {
      setErrorMessage('목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, page]);

  const content = (
    <InfiniteScroll<DemoItem>
      className="h-full w-full"
      items={items}
      getKey={item => item.id}
      renderItem={item => (
        <div className="w-full rounded-2xl border p-4">
          <div className="text-base font-medium">{item.title}</div>
          <div className="text-sm text-gray-500">{item.desc}</div>
        </div>
      )}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loader={
        loader ?? (
          <span>
            로딩 중… <span aria-hidden>⏳</span>
          </span>
        )
      }
      endMessage={endMessage ?? <span>끝까지 보셨습니다 👋</span>}
      errorSlot={msg => (
        <div className="flex items-center gap-2 text-red-500">
          <span>⚠️</span>
          <span>{msg}</span>
          <button onClick={onLoadMore} className="underline">
            다시 시도
          </button>
        </div>
      )}
    />
  );

  if (!useContainer) {
    return <div className="h-[500px] w-[360px]">{content}</div>;
  }

  return (
    <div
      className={clsx('w-[360px] overflow-y-auto rounded-2xl border p-3')}
      style={{ height: containerHeight }}
    >
      {content}
    </div>
  );
};

// ===== Storybook =====

const meta = {
  title: 'Components/Basics/InfiniteScroll',
  component: InfiniteScroll,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InfiniteScroll>;

export default meta;

type Story = StoryObj;

const demoArgTypes = {
  total: { control: 'number' },
  pageSize: { control: 'number' },
  delay: { control: 'number' },
  errorAtPage: { control: 'number' },
  useContainer: { control: 'boolean' },
  containerHeight: { control: 'number' },
};

export const Basic: Story = {
  name: '기본 (viewport scroll)',
  args: {
    total: DEFAULT_TOTAL,
    pageSize: DEFAULT_PAGE_SIZE,
    delay: DEFAULT_DELAY,
    useContainer: false,
  } as DemoStateProps,
  argTypes: demoArgTypes,
  render: (args: DemoStateProps) => <DemoList {...args} />,
};

export const WithError: Story = {
  name: '에러 발생',
  args: {
    total: DEFAULT_TOTAL,
    pageSize: DEFAULT_PAGE_SIZE,
    delay: 400,
    errorAtPage: 3,
    useContainer: false,
  } as DemoStateProps,
  argTypes: demoArgTypes,
  render: (args: DemoStateProps) => <DemoList {...args} />,
};

export const InContainer: Story = {
  name: '스크롤 컨테이너 내부',
  args: {
    total: DEFAULT_TOTAL,
    pageSize: DEFAULT_PAGE_SIZE,
    delay: DEFAULT_DELAY,
    useContainer: true,
    containerHeight: 420,
  } as DemoStateProps,
  argTypes: demoArgTypes,
  render: (args: DemoStateProps) => <DemoList {...args} />,
};
