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
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import { useEffect, useRef, useState } from 'react';

export default function AllLink() {
  const { selectedLinkId, selectLink } = useLinkStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { modal, open } = useModalStore();

  const listRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

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

  const links = data?.pages.flatMap(page => page.content) ?? [];

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

  if (isLoading)
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner />
      </div>
    );
  if (isError && !data)
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray600">링크를 불러오지 못했습니다.</p>
        <Button onClick={() => refetch()} label="다시 시도" />
      </div>
    );

  return (
    <div className="h-screen min-w-0">
      <div className="h-screen min-w-0 xl:flex">
        <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto flex h-full w-full max-w-200 flex-col gap-5">
            <header className="flex items-center justify-between">
              <h1 className="font-title-md">전체 링크</h1>
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
                    {links.map(link => (
                      <LinkCard
                        key={link.id}
                        title={link.title}
                        link={link.url}
                        summary={link.summary ?? ''}
                        imageUrl={link.imageUrl ?? ''}
                        onClick={() => handleSelectLink(link.id)}
                        selectable
                        isSelected={selectedIds.has(link.id)}
                        onSelect={() => handleToggleSelect(link.id)}
                      />
                    ))}
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
