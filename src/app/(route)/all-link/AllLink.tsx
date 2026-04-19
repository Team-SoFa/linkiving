'use client';

import Button from '@/components/basics/Button/Button';
import InfiniteScroll from '@/components/basics/InfiniteScroll/InfiniteScroll';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import DeleteLinkModal from '@/components/basics/LinkCard/components/DeleteLinkModal';
import Spinner from '@/components/basics/Spinner/Spinner';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { useGetInfiniteLinks } from '@/hooks/useGetInfiniteLinks';
import { useGetLink } from '@/hooks/useGetLink';
import useLinkCount from '@/hooks/useGetLinksCount';
import { useSummaryStatusSocket } from '@/hooks/useSummaryStatusSocket';
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import type { LinkSummaryStatus } from '@/types/link';
import { type Link } from '@/types/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LinkCardItem = memo(
  function LinkCardItem({
    item,
    isSelected,
    summaryStatus,
    summaryText,
    summaryErrorMessage,
    onSelect,
    onOpen,
  }: {
    item: Link;
    isSelected: boolean;
    summaryStatus: LinkSummaryStatus;
    summaryText: string;
    summaryErrorMessage?: string;
    onSelect: (id: number) => void;
    onOpen: (id: number) => void;
  }) {
    const handleClick = useCallback(() => onOpen(item.id), [item.id, onOpen]);
    const handleSelect = useCallback(() => onSelect(item.id), [item.id, onSelect]);

    return (
      <LinkCard
        title={item.title}
        link={item.url}
        summary={summaryText}
        summaryStatus={summaryStatus}
        summaryErrorMessage={summaryErrorMessage}
        imageUrl={item.imageUrl ?? ''}
        onClick={handleClick}
        selectable
        isSelected={isSelected}
        onSelect={handleSelect}
      />
    );
  },
  (prev, next) =>
    prev.item === next.item &&
    prev.isSelected === next.isSelected &&
    prev.summaryStatus === next.summaryStatus &&
    prev.summaryText === next.summaryText &&
    prev.summaryErrorMessage === next.summaryErrorMessage &&
    prev.onSelect === next.onSelect &&
    prev.onOpen === next.onOpen
);

export default function AllLink() {
  const { selectedLinkId, selectLink } = useLinkStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [summaryStatusByLinkId, setSummaryStatusByLinkId] = useState<
    Record<
      number,
      {
        status: LinkSummaryStatus;
        progress?: number;
        summary?: string;
        errorMessage?: string;
      }
    >
  >({});
  const { modal, open } = useModalStore();

  const listRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { count } = useLinkCount();
  const processingLinkIdsRef = useRef<Set<number>>(new Set());
  const linksRef = useRef<Link[]>([]); // ✅ 정상 위치

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useGetInfiniteLinks();

  const links = useMemo(() => data?.pages.flatMap(page => page.content) ?? [], [data]);

  // ✅ 최신 links 유지
  useEffect(() => {
    linksRef.current = links;
  }, [links]);

  // ✅ generating 상태 추적
  useEffect(() => {
    processingLinkIdsRef.current = new Set(
      links.filter(link => link.summaryStatus === 'generating').map(link => link.id)
    );
  }, [links]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modal.type === 'DELETE_LINK') return;

      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        !deleteButtonRef.current?.contains(e.target as Node)
      ) {
        setSelectedIds(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modal.type]);

  useSummaryStatusSocket({
    enabled: true,
    onEvent: event => {
      setSummaryStatusByLinkId(prev => ({
        ...prev,
        [event.linkId]: {
          status: event.status,
          progress: event.progress,
          summary: event.summary,
          errorMessage: event.errorMessage,
        },
      }));

      if (event.status === 'generating') {
        processingLinkIdsRef.current.add(event.linkId);
      }

      if (event.status === 'ready' || event.status === 'failed') {
        const wasProcessing = processingLinkIdsRef.current.has(event.linkId);
        const isVisibleLink = linksRef.current.some(link => link.id === event.linkId);

        processingLinkIdsRef.current.delete(event.linkId);

        if (wasProcessing || isVisibleLink) {
          refetch();
        }
      }
    },
  });

  const {
    data: selectedLinkDetail,
    isLoading: isSelectedLinkLoading,
    isError: isSelectedLinkError,
    refetch: refetchSelectedLink,
  } = useGetLink(isPanelOpen ? selectedLinkId : null);

  const handleLoadMore = useCallback(
    (_signal?: AbortSignal) => fetchNextPage().then(() => undefined),
    [fetchNextPage]
  );

  const handleSelectLink = useCallback(
    (id: number) => {
      selectLink(id);
      setIsPanelOpen(true);
    },
    [selectLink]
  );

  useEffect(() => {
    if (selectedLinkId !== null) {
      setIsPanelOpen(true);
    }
  }, [selectedLinkId]);

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const renderItem = useCallback(
    (link: Link) => {
      const statusInfo = summaryStatusByLinkId[link.id];

      const summaryStatus = statusInfo?.status ?? link.summaryStatus ?? 'idle';
      const summaryText = statusInfo?.summary ?? link.summary ?? '';

      return (
        <LinkCardItem
          item={link}
          isSelected={selectedIds.has(link.id)}
          summaryStatus={summaryStatus}
          summaryText={summaryText}
          summaryErrorMessage={statusInfo?.errorMessage}
          onSelect={handleToggleSelect}
          onOpen={handleSelectLink}
        />
      );
    },
    [selectedIds, summaryStatusByLinkId, handleToggleSelect, handleSelectLink]
  );

  const hasSelection = selectedIds.size > 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2">
        <p className="text-gray600">링크를 불러오지 못했습니다.</p>
        <Button onClick={() => refetch()} label="다시 시도" />
      </div>
    );
  }

  return (
    <div className="h-screen min-w-0">
      <div className="flex h-screen min-w-0 flex-col xl:flex-row">
        <div className="min-w-0 flex-1 px-10 py-15">
          <div className="mx-auto flex h-full w-full max-w-200 flex-col gap-5">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <h1 className="font-title-md">전체 링크</h1>
                <p className="font-body-md text-gray600">({count ?? links.length})</p>
              </div>
              {hasSelection && (
                <Button
                  ref={deleteButtonRef}
                  label={`${selectedIds.size}개 삭제`}
                  onClick={() => open('DELETE_LINK', { linkIds: [...selectedIds] })}
                />
              )}
            </header>

            <div ref={listRef} className="min-h-0 flex-1">
              {links.length === 0 ? (
                <p className="text-gray600">표시할 링크가 없습니다.</p>
              ) : (
                <InfiniteScroll
                  className="custom-scrollbar h-full overflow-y-auto p-1"
                  items={links}
                  getKey={item => item.id}
                  renderItem={renderItem}
                  onLoadMore={handleLoadMore}
                  hasMore={hasNextPage ?? false}
                  isLoading={isFetchingNextPage}
                />
              )}
            </div>
          </div>
        </div>

        {isPanelOpen && (
          <aside className="hidden h-screen shrink-0 xl:block xl:w-130">
            {isSelectedLinkLoading ? (
              <div className="border-gray200 flex h-full items-center justify-center rounded-2xl border bg-white p-6">
                <Spinner />
              </div>
            ) : isSelectedLinkError ? (
              <div className="border-gray200 text-gray600 flex h-full flex-col items-center justify-center gap-2 rounded-2xl border bg-white p-6">
                <p>상세 정보를 불러오지 못했습니다.</p>
                <Button onClick={() => refetchSelectedLink()} label="다시 시도" />
              </div>
            ) : selectedLinkDetail ? (
              <LinkCardDetailPanel
                id={selectedLinkDetail.id}
                url={selectedLinkDetail.url}
                title={selectedLinkDetail.title}
                summary={selectedLinkDetail.summary ?? ''}
                memo={selectedLinkDetail.memo ?? ''}
                imageUrl={selectedLinkDetail.imageUrl}
                onClose={() => {
                  setIsPanelOpen(false);
                  selectLink(null);
                }}
              />
            ) : (
              <div className="border-gray200 text-gray600 h-full rounded-2xl border bg-white p-6">
                상세 정보를 볼 링크를 선택해 주세요.
              </div>
            )}
          </aside>
        )}
      </div>

      {modal.type === 'DELETE_LINK' && (
        <DeleteLinkModal
          links={links
            .filter(l => modal.props.linkIds.includes(l.id))
            .map(l => ({ id: l.id, title: l.title, url: l.url }))}
          onSuccess={succeededIds => {
            setSelectedIds(prev => {
              const next = new Set(prev);
              succeededIds.forEach(id => next.delete(id));
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
