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
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import { type Link } from '@/types/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LinkCardItem = memo(
  function LinkCardItem({
    item,
    selectedIds,
    onSelect,
    onOpen,
  }: {
    item: Link;
    selectedIds: Set<number>;
    onSelect: (id: number) => void;
    onOpen: (id: number) => void;
  }) {
    const isSelected = selectedIds.has(item.id);
    const handleClick = useCallback(() => onOpen(item.id), [item.id, onOpen]);
    const handleSelect = useCallback(() => onSelect(item.id), [item.id, onSelect]);

    return (
      <LinkCard
        title={item.title}
        link={item.url}
        summary={item.summary ?? ''}
        imageUrl={item.imageUrl ?? ''}
        onClick={handleClick}
        selectable
        isSelected={isSelected}
        onSelect={handleSelect}
      />
    );
  },
  // 현재 아이템의 "선택 상태 변화"와 핸들러 참조가 바뀌었을 때만 리렌더링하도록 제어
  (prev, next) =>
    prev.selectedIds.has(prev.item.id) === next.selectedIds.has(next.item.id) &&
    prev.onSelect === next.onSelect &&
    prev.onOpen === next.onOpen
);

export default function AllLink() {
  const { selectedLinkId, selectLink } = useLinkStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { modal, open } = useModalStore();

  const listRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { count } = useLinkCount();

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

  const {
    data: selectedLinkDetail,
    isLoading: isSelectedLinkLoading,
    isError: isSelectedLinkError,
    refetch: refetchSelectedLink,
  } = useGetLink(isPanelOpen ? selectedLinkId : null);

  const links = useMemo(() => data?.pages.flatMap(page => page.content) ?? [], [data]);

  const handleLoadMore = useCallback(
    (_signal?: AbortSignal) => {
      return fetchNextPage().then(() => undefined);
    },
    [fetchNextPage]
  );

  const handleSelectLink = useCallback(
    (id: number) => {
      selectLink(id);
      setIsPanelOpen(true);
    },
    [selectLink]
  );

  // AddLink/index.tsx에서 링크 추가 후 토스트 버튼 클릭 시 store에 저장된 id에 해당하는 패널 열기
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

  // selectedIds를 의존성에 추가하면 selectedIds가 바뀔 때마다 renderItem, virtualizer 전체가 리렌더 되어 성능 최적화 깨짐
  const renderItem = useCallback(
    (link: Link) => (
      <LinkCardItem
        item={link}
        selectedIds={selectedIds}
        onSelect={handleToggleSelect}
        onOpen={handleSelectLink}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleToggleSelect, handleSelectLink]
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
