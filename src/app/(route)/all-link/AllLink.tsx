'use client';

import Button from '@/components/basics/Button/Button';
import CardList from '@/components/basics/CardList/CardList';
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
import { useEffect, useMemo, useRef, useState } from 'react';

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modal.type === 'DELETE_LINK') return; // 모달 열려있으면 스킵

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
  }, [modal.type]); // type을 의존성 배열에 추가하여 모달이 열렸을 때 외부 클릭 핸들러 실행 막음

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useGetInfiniteLinks();

  useSummaryStatusSocket({
    enabled: true,
    onConnect: () => {
      console.log('[summary-socket] connected to backend');
    },
    onDisconnect: () => {
      console.warn('[summary-socket] disconnected from backend');
    },
    onEvent: event => {
      console.log('[summary-socket] event received', event);
      setSummaryStatusByLinkId(prev => ({
        ...prev,
        [event.linkId]: {
          status: event.status,
          progress: event.progress,
          summary: event.summary,
          errorMessage: event.errorMessage,
        },
      }));

      // 요약 생성 시작 감지
      if (event.status === 'generating') {
        processingLinkIdsRef.current.add(event.linkId);
        console.log('[summary-socket] tracking linkId', event.linkId);
      }

      // 요약 생성 완료/실패 감지 → 최종 상태 도달 시 refetch
      if (event.status === 'ready' || event.status === 'failed') {
        const wasProcessing = processingLinkIdsRef.current.has(event.linkId);
        const isVisibleLink = links.some(link => link.id === event.linkId);

        processingLinkIdsRef.current.delete(event.linkId);

        if (wasProcessing || isVisibleLink) {
          console.log('[summary-socket] linkId summary complete', {
            linkId: event.linkId,
            status: event.status,
          });
          console.log('[summary-socket] refetching after summary', event.linkId);
          refetch();
        }
      }
    },
    onError: error => {
      console.error('[summary-socket] error', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        error,
      });
    },
  });

  const {
    data: selectedLinkDetail,
    isLoading: isSelectedLinkLoading,
    isError: isSelectedLinkError,
    refetch: refetchSelectedLink,
  } = useGetLink(isPanelOpen ? selectedLinkId : null);

  const links = useMemo(() => data?.pages.flatMap(page => page.content) ?? [], [data]);

  useEffect(() => {
    processingLinkIdsRef.current = new Set(
      links.filter(link => link.summaryStatus === 'generating').map(link => link.id)
    );
  }, [links]);

  const handleSelectLink = (id: number) => {
    selectLink(id);
    setIsPanelOpen(true);
  };

  // AddLink/index.tsx에서 링크 추가 후 토스트 버튼 클릭 시 store에 저장된 id에 해당하는 패널 열기
  useEffect(() => {
    if (selectedLinkId !== null) {
      setIsPanelOpen(true);
    }
  }, [selectedLinkId]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
      <div className="h-screen min-w-0 xl:flex">
        <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">
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
            <div ref={listRef} className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-1">
              {links.length === 0 ? (
                <p className="text-gray600">표시할 링크가 없습니다.</p>
              ) : (
                <InfiniteScroll
                  onLoadMore={() => {
                    fetchNextPage();
                  }}
                  hasMore={hasNextPage ?? false}
                  isLoading={isFetchingNextPage}
                >
                  <CardList>
                    {links.map(link => {
                      const statusInfo = summaryStatusByLinkId[link.id];
                      const summaryStatus = statusInfo?.status ?? link.summaryStatus ?? 'idle';
                      const summaryText = statusInfo?.summary ?? link.summary ?? '';
                      return (
                        <LinkCard
                          key={link.id}
                          title={link.title}
                          link={link.url}
                          summary={summaryText}
                          summaryStatus={summaryStatus}
                          summaryErrorMessage={statusInfo?.errorMessage}
                          imageUrl={link.imageUrl ?? ''}
                          onClick={() => handleSelectLink(link.id)}
                          selectable
                          isSelected={selectedIds.has(link.id)}
                          onSelect={() => handleToggleSelect(link.id)}
                        />
                      );
                    })}
                  </CardList>
                </InfiniteScroll>
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
            // 삭제 성공한 id만 선택 해제
            setSelectedIds(prev => {
              const next = new Set(prev);
              succeededIds.forEach(id => {
                next.delete(id);
              });
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
