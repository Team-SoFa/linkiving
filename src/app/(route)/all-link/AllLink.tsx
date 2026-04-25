'use client';

import {
  fetchLinkSummaryStatus,
  normalizeLinkSummaryStatus,
  resolveSummaryContent,
} from '@/apis/linkApi';
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
import { ApiError } from '@/lib/errors/ApiError';
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import type { LinkSummaryStatus } from '@/types/link';
import { type Link } from '@/types/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SummaryStatusInfo = {
  status: LinkSummaryStatus;
  progress?: number;
  summary?: string;
  errorMessage?: string;
};

const STATUS_POLL_INTERVAL_MS = 5000;
const MAX_GENERATING_POLL_ATTEMPTS = 36;
const MAX_GENERATING_STAGNANT_POLLS = 6;
const hasSummaryText = (summary: string): boolean => summary.trim().length > 0;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const getErrorStatus = (error: unknown): number | null => {
  if (!error || typeof error !== 'object' || !('status' in error)) return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
};

const isRetryableSummaryStatusError = (error: unknown): boolean => {
  const status = error instanceof ApiError ? error.status : getErrorStatus(error);
  if (status !== null) return RETRYABLE_STATUS_CODES.has(status);
  return true;
};

type GeneratingPollSnapshot = {
  progress?: number;
  updatedAt?: string;
  stagnantCount: number;
};

const resolveLinkSummaryStatus = (
  link: Link,
  statusInfo?: SummaryStatusInfo
): LinkSummaryStatus | undefined => {
  const summaryText = statusInfo?.summary ?? link.summary ?? '';
  const errorMessage = statusInfo?.errorMessage;

  if (statusInfo?.status) return statusInfo.status;
  if (link.summaryStatus !== undefined) {
    return normalizeLinkSummaryStatus(link.summaryStatus, summaryText, errorMessage);
  }
  if (typeof errorMessage === 'string' && errorMessage.trim()) return 'failed';
  if (hasSummaryText(summaryText)) return 'ready';

  return undefined;
};

const toPanelSummaryState = (status: LinkSummaryStatus): 'idle' | 'loading' | 'error' | 'ready' => {
  if (status === 'generating') return 'loading';
  if (status === 'failed') return 'error';
  if (status === 'ready') return 'ready';
  return 'idle';
};

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
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [summaryStatusByLinkId, setSummaryStatusByLinkId] = useState<
    Record<number, SummaryStatusInfo>
  >({});
  const { modal, open } = useModalStore();

  const listRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { count } = useLinkCount();
  const processingLinkIdsRef = useRef<Set<number>>(new Set());
  const polledUnknownLinkIdsRef = useRef<Set<number>>(new Set());
  const nonRetryablePollLinkIdsRef = useRef<Set<number>>(new Set());
  const generatingPollAttemptsRef = useRef<Map<number, number>>(new Map());
  const generatingPollSnapshotsRef = useRef<Map<number, GeneratingPollSnapshot>>(new Map());
  const exhaustedGeneratingLinkIdsRef = useRef<Set<number>>(new Set());
  const linksRef = useRef<Link[]>([]);
  const summaryStatusByLinkIdRef = useRef<Record<number, SummaryStatusInfo>>({});
  const selectedLinkIdRef = useRef<number | null>(selectedLinkId);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useGetInfiniteLinks();

  const links = useMemo(() => data?.pages.flatMap(page => page.content) ?? [], [data]);

  // ✅ 최신 links 유지
  useEffect(() => {
    linksRef.current = links;
  }, [links]);

  useEffect(() => {
    const visibleLinkIds = new Set(links.map(link => link.id));

    polledUnknownLinkIdsRef.current.forEach(linkId => {
      if (!visibleLinkIds.has(linkId)) {
        polledUnknownLinkIdsRef.current.delete(linkId);
      }
    });

    nonRetryablePollLinkIdsRef.current.forEach(linkId => {
      if (!visibleLinkIds.has(linkId)) {
        nonRetryablePollLinkIdsRef.current.delete(linkId);
      }
    });

    generatingPollAttemptsRef.current.forEach((_value, linkId) => {
      if (!visibleLinkIds.has(linkId)) {
        generatingPollAttemptsRef.current.delete(linkId);
      }
    });

    generatingPollSnapshotsRef.current.forEach((_value, linkId) => {
      if (!visibleLinkIds.has(linkId)) {
        generatingPollSnapshotsRef.current.delete(linkId);
      }
    });

    exhaustedGeneratingLinkIdsRef.current.forEach(linkId => {
      if (!visibleLinkIds.has(linkId)) {
        exhaustedGeneratingLinkIdsRef.current.delete(linkId);
      }
    });
  }, [links]);

  useEffect(() => {
    polledUnknownLinkIdsRef.current.clear();
    nonRetryablePollLinkIdsRef.current.clear();
    generatingPollAttemptsRef.current.clear();
    generatingPollSnapshotsRef.current.clear();
    exhaustedGeneratingLinkIdsRef.current.clear();
  }, [isSocketConnected]);

  useEffect(() => {
    summaryStatusByLinkIdRef.current = summaryStatusByLinkId;
  }, [summaryStatusByLinkId]);

  useEffect(() => {
    selectedLinkIdRef.current = selectedLinkId;
  }, [selectedLinkId]);

  useEffect(() => {
    processingLinkIdsRef.current = new Set(
      links
        .filter(
          link => resolveLinkSummaryStatus(link, summaryStatusByLinkId[link.id]) === 'generating'
        )
        .map(link => link.id)
    );
  }, [links, summaryStatusByLinkId]);

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

  const {
    data: selectedLinkDetail,
    isLoading: isSelectedLinkLoading,
    isError: isSelectedLinkError,
    refetch: refetchSelectedLink,
  } = useGetLink(isPanelOpen ? selectedLinkId : null);

  useSummaryStatusSocket({
    enabled: true,
    onConnect: () => {
      setIsSocketConnected(true);
    },
    onDisconnect: () => {
      setIsSocketConnected(false);
    },
    onError: () => {
      setIsSocketConnected(false);
    },
    onEvent: event => {
      polledUnknownLinkIdsRef.current.delete(event.linkId);
      nonRetryablePollLinkIdsRef.current.delete(event.linkId);
      generatingPollAttemptsRef.current.delete(event.linkId);
      generatingPollSnapshotsRef.current.delete(event.linkId);
      exhaustedGeneratingLinkIdsRef.current.delete(event.linkId);

      setSummaryStatusByLinkId(prev => {
        const previous = prev[event.linkId];

        return {
          ...prev,
          [event.linkId]: {
            status: event.status,
            progress: event.progress ?? previous?.progress,
            summary: event.summary ?? previous?.summary,
            errorMessage: event.errorMessage ?? previous?.errorMessage,
          },
        };
      });

      if (event.status === 'generating') {
        processingLinkIdsRef.current.add(event.linkId);
      }

      if (event.status === 'ready' || event.status === 'failed') {
        const wasProcessing = processingLinkIdsRef.current.has(event.linkId);
        const isVisibleLink = linksRef.current.some(link => link.id === event.linkId);

        processingLinkIdsRef.current.delete(event.linkId);

        if (wasProcessing || isVisibleLink) {
          void refetch();
        }

        if (selectedLinkIdRef.current === event.linkId) {
          void refetchSelectedLink();
        }
      }
    },
  });

  useEffect(() => {
    if (isSocketConnected) return;

    let cancelled = false;
    let inFlight = false;

    const pollSummaryStatus = async () => {
      if (cancelled || inFlight) return;

      const linksSnapshot = linksRef.current;
      const statusSnapshot = summaryStatusByLinkIdRef.current;
      const targetModes = new Map<number, 'generating' | 'unknown'>();
      const targetIds: number[] = [];

      for (const link of linksSnapshot) {
        if (nonRetryablePollLinkIdsRef.current.has(link.id)) continue;
        if (exhaustedGeneratingLinkIdsRef.current.has(link.id)) continue;

        const statusInfo = statusSnapshot[link.id];
        const summaryText = statusInfo?.summary ?? link.summary ?? '';
        if (hasSummaryText(summaryText)) {
          generatingPollAttemptsRef.current.delete(link.id);
          generatingPollSnapshotsRef.current.delete(link.id);
          exhaustedGeneratingLinkIdsRef.current.delete(link.id);
          continue;
        }

        const resolvedStatus = resolveLinkSummaryStatus(link, statusInfo);
        if (resolvedStatus === 'generating') {
          const currentAttempts = generatingPollAttemptsRef.current.get(link.id) ?? 0;
          if (currentAttempts >= MAX_GENERATING_POLL_ATTEMPTS) {
            exhaustedGeneratingLinkIdsRef.current.add(link.id);
            continue;
          }

          targetModes.set(link.id, 'generating');
          targetIds.push(link.id);
          continue;
        }

        if (resolvedStatus !== undefined) continue;
        if (polledUnknownLinkIdsRef.current.has(link.id)) continue;

        polledUnknownLinkIdsRef.current.add(link.id);
        targetModes.set(link.id, 'unknown');
        targetIds.push(link.id);
      }

      if (targetIds.length === 0) return;

      inFlight = true;
      try {
        const results = await Promise.all(
          targetIds.map(async linkId => {
            try {
              const data = await fetchLinkSummaryStatus(linkId);
              return { linkId, data, retryable: false };
            } catch (error) {
              return {
                linkId,
                data: null,
                retryable: isRetryableSummaryStatusError(error),
              };
            }
          })
        );

        if (cancelled) return;

        let shouldRefetchLinks = false;
        let shouldRefetchSelectedLink = false;
        const summaryUpdates: Array<{
          linkId: number;
          data: NonNullable<Awaited<ReturnType<typeof fetchLinkSummaryStatus>>>;
          status: LinkSummaryStatus;
          summaryText: string;
        }> = [];

        for (const result of results) {
          if (result.data) {
            const summaryText = resolveSummaryContent(result.data.summary);
            const status = normalizeLinkSummaryStatus(
              result.data.status,
              summaryText,
              result.data.errorMessage
            );

            nonRetryablePollLinkIdsRef.current.delete(result.linkId);

            if (targetModes.get(result.linkId) === 'generating' && status === 'generating') {
              const currentAttempts = generatingPollAttemptsRef.current.get(result.linkId) ?? 0;
              generatingPollAttemptsRef.current.set(result.linkId, currentAttempts + 1);
            }

            summaryUpdates.push({
              linkId: result.linkId,
              data: result.data,
              summaryText,
              status,
            });
            continue;
          }

          if (result.retryable) {
            if (targetModes.get(result.linkId) === 'unknown') {
              polledUnknownLinkIdsRef.current.delete(result.linkId);
            }

            const attempts = generatingPollAttemptsRef.current.get(result.linkId) ?? 0;
            if (attempts >= MAX_GENERATING_POLL_ATTEMPTS) {
              exhaustedGeneratingLinkIdsRef.current.add(result.linkId);
            }
            continue;
          }

          nonRetryablePollLinkIdsRef.current.add(result.linkId);
        }

        for (const { linkId, data, status } of summaryUpdates) {
          if (status === 'generating') {
            processingLinkIdsRef.current.add(linkId);

            const previousSnapshot = generatingPollSnapshotsRef.current.get(linkId);
            const currentProgress =
              typeof data.progress === 'number' ? data.progress : previousSnapshot?.progress;
            const currentUpdatedAt =
              typeof data.updatedAt === 'string' ? data.updatedAt : undefined;
            const hasProgressChanged = previousSnapshot?.progress !== currentProgress;
            const hasUpdatedAtChanged =
              typeof currentUpdatedAt === 'string' &&
              currentUpdatedAt !== previousSnapshot?.updatedAt;
            const stagnantCount =
              hasProgressChanged || hasUpdatedAtChanged
                ? 0
                : (previousSnapshot?.stagnantCount ?? 0) + 1;

            generatingPollSnapshotsRef.current.set(linkId, {
              progress: currentProgress,
              updatedAt: currentUpdatedAt,
              stagnantCount,
            });

            const attempts = generatingPollAttemptsRef.current.get(linkId) ?? 0;
            if (
              stagnantCount >= MAX_GENERATING_STAGNANT_POLLS ||
              attempts >= MAX_GENERATING_POLL_ATTEMPTS
            ) {
              exhaustedGeneratingLinkIdsRef.current.add(linkId);
            }
          }

          if (status === 'ready' || status === 'failed') {
            processingLinkIdsRef.current.delete(linkId);
            generatingPollAttemptsRef.current.delete(linkId);
            generatingPollSnapshotsRef.current.delete(linkId);
            exhaustedGeneratingLinkIdsRef.current.delete(linkId);
            shouldRefetchLinks = true;
            if (selectedLinkIdRef.current === linkId) {
              shouldRefetchSelectedLink = true;
            }
          }
        }

        setSummaryStatusByLinkId(prev => {
          let changed = false;
          const next = { ...prev };

          for (const { linkId, data, status, summaryText } of summaryUpdates) {
            const previous = prev[linkId];
            const merged: SummaryStatusInfo = {
              status,
              progress: typeof data.progress === 'number' ? data.progress : previous?.progress,
              summary: summaryText || previous?.summary,
              errorMessage:
                typeof data.errorMessage === 'string' ? data.errorMessage : previous?.errorMessage,
            };

            if (
              previous?.status === merged.status &&
              previous?.progress === merged.progress &&
              previous?.summary === merged.summary &&
              previous?.errorMessage === merged.errorMessage
            ) {
              continue;
            }

            changed = true;
            next[linkId] = merged;
          }

          return changed ? next : prev;
        });

        if (shouldRefetchLinks) {
          void refetch();
        }

        if (shouldRefetchSelectedLink) {
          void refetchSelectedLink();
        }
      } finally {
        inFlight = false;
      }
    };

    void pollSummaryStatus();
    const interval = window.setInterval(() => {
      void pollSummaryStatus();
    }, STATUS_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isSocketConnected, refetch, refetchSelectedLink]);

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

      const summaryStatus = resolveLinkSummaryStatus(link, statusInfo) ?? 'idle';
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
  const selectedStatusInfo = selectedLinkDetail
    ? summaryStatusByLinkId[selectedLinkDetail.id]
    : undefined;
  const selectedSummaryText = selectedStatusInfo?.summary ?? selectedLinkDetail?.summary ?? '';
  const selectedSummaryStatus = selectedLinkDetail
    ? (resolveLinkSummaryStatus(selectedLinkDetail, selectedStatusInfo) ?? 'idle')
    : 'idle';

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
                summary={selectedSummaryText}
                memo={selectedLinkDetail.memo ?? ''}
                imageUrl={selectedLinkDetail.imageUrl}
                summaryState={toPanelSummaryState(selectedSummaryStatus)}
                summaryErrorMessage={selectedStatusInfo?.errorMessage}
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
