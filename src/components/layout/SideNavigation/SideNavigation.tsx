'use client';

import { useSideNavStore } from '@/stores/sideNavStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import SideNavigationBottom from './components/Bottom/SideNavigationBottom';
import ChatRoomSection from './components/ChatRoomSection/ChatRoomSection';
import SideNavigationHeader from './components/Header/SideNavigationHeader';
import MenuSection from './components/MenuSection/MenuSection';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export default function SideNavigation() {
  const { isOpen, toggle, setOpen } = useSideNavStore();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null); // 모바일 메뉴 닫힐 때 트리거 버튼으로 포커스 돌려주기 위함

  // 모바일 메뉴 열릴 때
  useEffect(() => {
    if (isOpen && isMobile) {
      navRef.current?.focus();
    }
  }, [isOpen, isMobile]);

  // 모바일 메뉴 닫힐 때
  useEffect(() => {
    if (!isOpen && isMobile) {
      triggerRef.current?.focus();
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [pathname, isMobile, setOpen]);
  if (isMobile === null) return null;
  if (isMobile) {
    return (
      <>
        {!isOpen && (
          <div className="fixed top-5 left-5 z-50">
            <SideNavigationHeader isOpen={false} onClick={toggle} />
          </div>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
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
              tabIndex={-1}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setOpen(false);
                }
              }}
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="bg-gray50 fixed top-0 left-0 z-50 flex h-screen w-60 flex-col overflow-hidden p-5 shadow-md"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex min-h-0 flex-1 flex-col">
                  <SideNavigationHeader isOpen={true} onClick={toggle} />
                  <MenuSection isOpen={true} />
                  <ChatRoomSection />
                </div>
                <SideNavigationBottom />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="bg-gray50 sticky top-0 flex h-screen flex-col justify-between overflow-hidden p-5 shadow-md"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex min-h-0 flex-1 flex-col">
          <SideNavigationHeader isOpen={isOpen} onClick={toggle} />
          <MenuSection isOpen={isOpen} />
          {isOpen && <ChatRoomSection />}
        </div>
        <SideNavigationBottom />
      </div>
    </motion.div>
  );
}
