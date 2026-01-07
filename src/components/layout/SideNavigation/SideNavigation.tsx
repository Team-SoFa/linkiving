'use client';

import { useSideNavStore } from '@/stores/sideNavStore';
import { motion } from 'framer-motion';

import ChatRoomSection from './components/ChatRoomSection/ChatRoomSection';
import SideNavigationHeader from './components/Header/SideNavigationHeader';
import MenuSection from './components/MenuSection/MenuSection';
import SideNavigationBottom from './components/SideNavBottom/SideNavBottom';

export default function SideNavigation() {
  const { isOpen, toggle } = useSideNavStore();

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 80 }} // px 단위도 가능
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="bg-gray50 flex h-screen flex-col justify-between overflow-hidden p-5 shadow-md"
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
