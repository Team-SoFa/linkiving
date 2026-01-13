'use client';

import ReactQueryProvider from '@/components/ReactQueryProvider';
import SideNavigation from '@/components/layout/SideNavigation/SideNavigation';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 랜딩에서는 SideNavigation 숨김
  const showSideNav = pathname !== '/';

  return (
    <div className="flex h-screen bg-white">
      {showSideNav && <SideNavigation />}
      <main className="h-screen flex-1 overflow-hidden">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </main>
    </div>
  );
}
