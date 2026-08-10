'use client';

import useEscKeyPress from '@/hooks/util/useEscKeyPress';
import { useIsMobile } from '@/hooks/util/useIsMobile';
import { useSideNavStore } from '@/stores/sideNavStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import SideNavigationBottom from './components/Bottom/SideNavigationBottom';
import ChatRoomSection from './components/ChatRoomSection/ChatRoomSection';
import SideNavigationHeader from './components/Header/SideNavigationHeader';
import MenuSection from './components/MenuSection/MenuSection';

/** 메뉴 + 채팅 목록을 담는 단일 스크롤 영역. 중첩 스크롤러는 iOS 에서 터치가 갇히므로 만들지 않는다. */
const SCROLLER_CLASS =
  'custom-scrollbar flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain';

export default function SideNavigation() {
  const isOpen = useSideNavStore(state => state.isOpen);
  const toggle = useSideNavStore(state => state.toggle);
  const setOpen = useSideNavStore(state => state.setOpen);

  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isDrawerOpen = isMobile && isOpen;

  const close = useCallback(() => setOpen(false), [setOpen]);

  // 포커스가 드로어 밖(예: 트리거)에 있어도 닫히도록 document 레벨에서 처리
  useEscKeyPress({ onEscPress: close, enabled: isDrawerOpen });

  // 열릴 때 이전 포커스를 저장하고 패널로 이동, 닫힐 때 복원.
  // isDrawerOpen 이 true 인 동안에만 동작하므로 마운트 시 포커스를 훔치지 않는다.
  useEffect(() => {
    if (!isDrawerOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    navRef.current?.focus();

    // 트리거는 모바일 트리에서 항상 렌더되므로 effect 시점에 캡처해 두어도 안전하다
    const trigger = triggerRef.current;

    return () => {
      const restoreTarget = previousFocusRef.current ?? trigger;
      restoreTarget?.focus?.();
    };
  }, [isDrawerOpen]);

  // 안전망: 항목 클릭 외의 경로 변경(프로그래매틱 네비게이션, 뒤로가기 등)
  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [pathname, isMobile, setOpen]);

  if (isMobile) {
    return (
      // backdrop / drawer / trigger 를 하나의 z-40 스태킹 컨텍스트로 묶는다.
      // 같은 z 안에서는 DOM 순서가 페인트 순서이므로 트리거가 드로어 위에 그려지면서도
      // 그룹 전체는 z-50 오버레이 티어(Modal, LinkCardDetailPanel)보다 아래에 있게 된다.
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-dvh">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={close}
              className="pointer-events-auto absolute inset-0 bg-black/10 backdrop-blur-[2px]"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="nav"
              ref={navRef}
              role="dialog"
              aria-modal="true"
              aria-label="사이드 내비게이션"
              tabIndex={-1}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              // 스크림이 더 이상 어둡지 않으므로 분리감은 elevation 으로 확보한다
              className="bg-gray50 pointer-events-auto absolute top-0 left-0 flex h-full w-60 flex-col overflow-hidden p-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_0_24px_rgba(17,19,29,0.16)] outline-none"
            >
              <div className={SCROLLER_CLASS}>
                {/* 플로팅 트리거 자리 */}
                <div className="mb-8 h-10 shrink-0" />
                <MenuSection />
                <ChatRoomSection />
              </div>
              <SideNavigationBottom />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 트리거는 DOM 상 마지막 = 같은 z 안에서 맨 위. 마운트/언마운트 없이 항상 렌더 */}
        <div className="pointer-events-auto absolute top-[max(1.25rem,env(safe-area-inset-top))] left-5">
          <SideNavigationHeader
            ref={triggerRef}
            isOpen={isOpen}
            onClick={toggle}
            variant="tertiary_neutral"
            floating
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="bg-gray50 sticky top-0 flex h-full shrink-0 flex-col overflow-hidden p-5 shadow-md"
    >
      <div className={SCROLLER_CLASS}>
        {/* 스크롤해도 헤더/메뉴는 상단에 고정 */}
        <div className="bg-gray50 sticky top-0 z-1 shrink-0">
          <SideNavigationHeader isOpen={isOpen} onClick={toggle} />
          <MenuSection />
        </div>
        {isOpen && <ChatRoomSection />}
      </div>
      <SideNavigationBottom />
    </motion.div>
  );
}
