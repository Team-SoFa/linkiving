'use client';

import InfiniteScroll from '@/components/basics/InfiniteScroll/InfiniteScroll';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { mockLinks } from '@/mocks';
import { useLinkStore } from '@/stores/linkStore';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 12;

export default function AllLink() {
  const { links, selectedLinkId, selectLink, setLinks } = useLinkStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // TODO: API 연결 시 useGetLinks로 데이터 연동
  // const { data, isLoading, isError, error } = useGetLinks({ size: 20 });

  useEffect(() => {
    setLinks(mockLinks.slice(0, PAGE_SIZE));
  }, [setLinks]);

  const hasMore = links.length < mockLinks.length;

  const selectedLink = links.find(link => link.id === selectedLinkId) ?? null;

  const handleSelectLink = (id: number) => {
    selectLink(id);
    setIsPanelOpen(true);
  };

  const handleLoadMore = async () => {
    if (!hasMore) return;
    setIsLoadingMore(true);
    const nextCount = Math.min(links.length + PAGE_SIZE, mockLinks.length);
    setLinks(mockLinks.slice(0, nextCount));
    setIsLoadingMore(false);
  };

  return (
    <div className="h-screen min-w-0">
      <div className="h-screen min-w-0 xl:flex">
        <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto flex h-full w-full max-w-200 flex-col gap-5">
            <header>
              <h1 className="font-title-md">전체 링크</h1>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {links.length === 0 ? (
                <p className="text-gray600">표시할 링크가 없습니다.</p>
              ) : (
                <InfiniteScroll
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  isLoading={isLoadingMore}
                >
                  <div className="grid min-w-0 grid-cols-2 justify-center justify-items-center gap-5 md:grid-cols-3 xl:grid-cols-4">
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
                  </div>
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
