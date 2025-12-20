'use client';

import LinkCard from '@/components/basics/LinkCard/LinkCard';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { useLinkStore } from '@/stores/linkStore';
import { useState } from 'react';

export default function AllLink() {
  const { links, selectedLinkId, selectLink } = useLinkStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const selectedLink = links.find(link => link.id === selectedLinkId) ?? null;

  const handleSelectLink = (id: number) => {
    selectLink(id);
    setIsPanelOpen(true);
  };

  return (
    <div className="min-h-screen min-w-0">
      <div className="min-h-screen min-w-0 xl:flex">
        <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-200 flex-col gap-6">
            <header>
              <h1 className="text-2xl font-semibold">전체 링크</h1>
              <p className="text-gray600 text-sm">
                저장된 링크를 모아보고, 우측 패널에서 상세 정보를 확인할 수 있어요.
              </p>
            </header>
            {links.length === 0 ? (
              <p className="text-gray600">표시할 링크가 없습니다.</p>
            ) : (
              <div className="grid min-w-0 grid-cols-2 justify-center justify-items-center gap-4 md:grid-cols-3 xl:grid-cols-4">
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
            )}
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
