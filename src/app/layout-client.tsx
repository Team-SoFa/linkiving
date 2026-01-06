'use client';

import ReactQueryProvider from '@/components/ReactQueryProvider';
import SideNavigation from '@/components/layout/SideNavigation/SideNavigation';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 랜딩에서는 SideNavigation 숨김
  const showSideNav = pathname !== '/';

  return (
    <ReactQueryProvider>
      <div className="flex min-h-screen bg-white">
        {showSideNav && <SideNavigation />}
        <main className="min-h-screen flex-1 overflow-x-hidden">{children}</main>
      </div>
    </ReactQueryProvider>
  );
}
