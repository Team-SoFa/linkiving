'use client';

import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { useChatRightPanelStore } from '@/stores/chatRightPanelStore';
import { usePathname } from 'next/navigation';

export default function ChatRightSidebar() {
  const pathname = usePathname();
  const { selectedLink, clearSelectedLink } = useChatRightPanelStore();

  if (pathname !== '/chat') return null;

  if (!selectedLink) return null;

  return (
    <aside className="border-gray200 bg-gray50 hidden h-screen w-130 shrink-0 border-l xl:block">
      <LinkCardDetailPanel
        url={selectedLink.url}
        title={selectedLink.title}
        summary={selectedLink.summary}
        memo=""
        imageUrl={selectedLink.imageUrl}
        onClose={clearSelectedLink}
      />
    </aside>
  );
}
