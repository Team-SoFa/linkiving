'use client';

import { getUserInfoFromCookie } from '@/hooks/useUserInfo';
import { useSideNavStore } from '@/stores/sideNavStore';
import { motion } from 'framer-motion';

import SideNavigationBottom from './components/Bottom/SideNavigationBottom';
import ChatRoomSection from './components/ChatRoomSection/ChatRoomSection';
import SideNavigationHeader from './components/Header/SideNavigationHeader';
import MenuSection from './components/MenuSection/MenuSection';

export default function SideNavigation() {
  const { isOpen, toggle } = useSideNavStore();
  const userInfo = getUserInfoFromCookie();

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 80 }} // px 단위도 가능
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="bg-gray50 sticky top-0 flex h-screen flex-col justify-between overflow-hidden p-5 shadow-md"
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <SideNavigationHeader isOpen={isOpen} onClick={toggle} />
            <MenuSection isOpen={isOpen} />
            {isOpen && <ChatRoomSection />}
          </div>
          <SideNavigationBottom />
        </div>
      </motion.div>
    </>
  );
}
