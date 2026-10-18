import useSelectSummary from '@/hooks/useSelectSummary';
import type { useSummaryStatusSocket } from '@/hooks/useSummaryStatusSocket';
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import type { Link } from '@/types/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, act } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AllLink from './AllLink';

const mocks = vi.hoisted(() => ({
  fetchLink: vi.fn(),
  fetchLinks: vi.fn(),
  select: vi.fn(),
  toast: vi.fn(),
  socket: vi.fn(),
}));
vi.mock('@/apis/linkApi', () => ({
  fetchLink: mocks.fetchLink,
  fetchLinks: mocks.fetchLinks,
  fetchLinkSummaryStatus: vi.fn(),
  normalizeLinkSummaryStatus: vi.fn(),
  resolveSummaryContent: vi.fn(),
}));
vi.mock('@/apis/summary', () => ({ selectNewSummary: mocks.select }));
vi.mock('@/stores/toastStore', () => ({ showToast: mocks.toast }));
vi.mock('@/hooks/useGetLinksCount', () => ({ default: () => ({ count: 1 }) }));
vi.mock('@/hooks/useSummaryStatusSocket', () => ({ useSummaryStatusSocket: mocks.socket }));
// 화면 상태와 React Query는 실제로 실행하고, 이 검증과 무관한 표현 컴포넌트만 단순화한다.
vi.mock('@/components/basics/Button/Button', () => ({ default: () => null }));
vi.mock('@/components/basics/Spinner/Spinner', () => ({ default: () => null }));
vi.mock('@/components/basics/LinkCard/components/DeleteLinkModal', () => ({ default: () => null }));
vi.mock('@/components/basics/InfiniteScroll/InfiniteScroll', () => ({
  default: ({ items, renderItem }: { items: Link[]; renderItem: (link: Link) => ReactNode }) => (
    <div>
      {items.map(item => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
    </div>
  ),
}));
vi.mock('@/components/basics/LinkCard/LinkCard', () => ({
  default: ({ summary, onClick }: { summary: string; onClick: () => void }) => (
    <button data-testid="link-card" onClick={onClick}>
      {summary}
    </button>
  ),
}));
vi.mock('@/components/wrappers/LinkCardDetailPanel/DetailPanelShell', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel', () => ({
  default: ({ summary }: { summary: string }) => <output data-testid="detail">{summary}</output>,
}));

let select: ReturnType<typeof useSelectSummary>;
function SelectionHarness() {
  select = useSelectSummary();
  return <AllLink />;
}
const original: Link = {
  id: 'selected',
  title: '링크',
  url: 'https://example.com',
  summary: '이전 요약',
  summaryStatus: 'ready',
  createdAt: '',
  updatedAt: '',
};
const page = (summary: string) => ({
  content: [{ ...original, summary }],
  hasNext: false,
  lastId: null,
});

describe('전체 링크 선택 요약 반영', () => {
  let client: QueryClient;
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.clearAllMocks();
    mocks.fetchLink.mockResolvedValue(original);
    mocks.fetchLinks.mockResolvedValue(page(original.summary));
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    client.setQueryData(['links', { size: 3 }], page(original.summary));
    useLinkStore.setState({ selectedLinkId: null, isDetailPanelOpen: false });
    useModalStore.getState().open('RE_SUMMARY', { linkId: original.id });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    await act(async () =>
      root.render(
        <QueryClientProvider client={client}>
          <SelectionHarness />
        </QueryClientProvider>
      )
    );
    await vi.waitFor(() =>
      expect(container.querySelector('[data-testid="link-card"]')).not.toBeNull()
    );
    await act(async () =>
      (container.querySelector('[data-testid="link-card"]') as HTMLButtonElement).click()
    );
    await vi.waitFor(() =>
      expect(container.querySelector('[data-testid="detail"]')?.textContent).toBe('이전 요약')
    );
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    client.clear();
    container.remove();
    vi.unstubAllGlobals();
  });

  it('이전 완료 소켓 상태가 있어도 선택 저장 후 목록과 상세가 새 요약을 표시한다', async () => {
    const socket = mocks.socket.mock.lastCall![0] as Parameters<typeof useSummaryStatusSocket>[0];
    await act(async () =>
      socket.onEvent?.({ linkId: original.id, status: 'ready', summary: '이전 요약' })
    );
    mocks.select.mockImplementation(async () => {
      mocks.fetchLink.mockResolvedValue({ ...original, summary: '선택한 새 요약' });
      mocks.fetchLinks.mockResolvedValue(page('선택한 새 요약'));
      return { content: '선택한 새 요약' };
    });
    await act(async () => {
      await select.mutateAsync({ id: original.id, summary: '선택한 새 요약', format: 'CONCISE' });
    });
    await vi.waitFor(() => {
      expect(container.querySelector('[data-testid="link-card"]')?.textContent).toBe(
        '선택한 새 요약'
      );
      expect(container.querySelector('[data-testid="detail"]')?.textContent).toBe('선택한 새 요약');
    });
    expect(useModalStore.getState().modal.type).toBeNull();
    expect(mocks.toast).not.toHaveBeenCalled();
  });

  it('저장이 실패하면 기존 요약과 재생성 모달을 유지한다', async () => {
    mocks.select.mockRejectedValue(new Error('저장 실패'));
    await act(async () => {
      await expect(
        select.mutateAsync({ id: original.id, summary: '새 요약', format: 'CONCISE' })
      ).rejects.toThrow('저장 실패');
    });
    expect(container.querySelector('[data-testid="detail"]')?.textContent).toBe('이전 요약');
    expect(container.querySelector('[data-testid="link-card"]')?.textContent).toBe('이전 요약');
    expect(useModalStore.getState().modal.type).toBe('RE_SUMMARY');
    expect(mocks.toast).toHaveBeenCalledOnce();
  });
});
