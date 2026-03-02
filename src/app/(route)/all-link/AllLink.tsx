'use client';

import Button from '@/components/basics/Button/Button';
import CardList from '@/components/basics/CardList/CardList';
import InfiniteScroll from '@/components/basics/InfiniteScroll/InfiniteScroll';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import Spinner from '@/components/basics/Spinner/Spinner';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { useGetInfiniteLinks } from '@/hooks/useGetInfiniteLinks';
import { useLinkStore } from '@/stores/linkStore';
import { useState } from 'react';

export default function AllLink() {
  const { selectedLinkId, selectLink } = useLinkStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useGetInfiniteLinks();

  // 전체 페이지 평탄화
  const links = data?.pages.flatMap(page => page.content) ?? [];

  const selectedLink = links.find(link => link.id === selectedLinkId) ?? null;

  const handleSelectLink = (id: number) => {
    selectLink(id);
    setIsPanelOpen(true);
  };

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
            <header>
              <h1 className="font-title-md">전체 링크</h1>
            </header>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-1">
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
            {selectedLink ? (
              <LinkCardDetailPanel
                url={selectedLink.url}
                title={selectedLink.title}
                summary={selectedLink.summary ?? ''}
                memo={selectedLink.memo ?? ''}
                imageUrl={selectedLink.imageUrl}
                onClose={() => setIsPanelOpen(false)}
              />
            ) : (
              <div className="border-gray200 text-gray600 h-full rounded-2xl border bg-white p-6">
                상세 정보를 볼 링크를 선택해 주세요.
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
