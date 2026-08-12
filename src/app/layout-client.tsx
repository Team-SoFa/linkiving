'use client';

import AnalyticsIdentity from '@/components/AnalyticsIdentity';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import SideNavigation from '@/components/layout/SideNavigation/SideNavigation';
import SideNavModals from '@/components/layout/SideNavigation/components/SideNavModals';
import { useIsMobile } from '@/hooks/util/useIsMobile';
import { useSideNavStore } from '@/stores/sideNavStore';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isSideNavOpen = useSideNavStore(state => state.isOpen);

  // 랜딩에서는 SideNavigation 숨김
  const showSideNav = !['/', '/signup', '/terms', '/account-deleted'].includes(pathname);
  const isDrawerOpen = showSideNav && isMobile && isSideNavOpen;

  return (
    <ReactQueryProvider>
      {showSideNav && <AnalyticsIdentity />}
      {/*
        사이드내비 라우트는 셸을 정확히 한 뷰포트로 고정한다.
        - 문서가 스크롤되지 않으므로 모바일 URL 바가 접히지 않고,
          그에 따른 position:fixed 히트테스트 어긋남(모바일 열림 버튼 미작동)이 원천 차단된다.
        - 드로어를 열었을 때 배경 스크롤도 자동으로 막힌다 (별도 body lock 불필요).
        해당 라우트들은 모두 내부 스크롤 컨테이너를 갖고 있어 잃는 것이 없다.
        랜딩/가입/약관은 기존대로 창 스크롤을 유지한다.
      */}
      <div className={clsx('flex bg-white', showSideNav ? 'h-dvh overflow-hidden' : 'min-h-dvh')}>
        {showSideNav && <SideNavigation />}
        <main
          inert={isDrawerOpen}
          className={clsx('min-w-0 flex-1 overflow-x-clip', showSideNav ? 'h-full' : 'min-h-dvh')}
        >
          {children}
        </main>
      </div>
      {/* 드로어가 닫힐 때 함께 언마운트되지 않도록 셸 밖에서 렌더한다 */}
      {showSideNav && <SideNavModals />}
    </ReactQueryProvider>
  );
}
