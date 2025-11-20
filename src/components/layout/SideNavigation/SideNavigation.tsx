'use client';

import { useModalStore } from '@/stores/modalStore';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import AddLinkButton from './components/AddLink/AddLinkButton';
import AddLinkIconButton from './components/AddLink/AddLinkIconButton';
import AddLinkModal from './components/AddLinkModal/AddLinkModal';
import AllLinkLinkButton from './components/AllLink/AllLinkButton';
import AllLinkLinkIconButton from './components/AllLink/AllLinkIconButton';
import NewChatLinkButton from './components/NewChat/NewChatButton';
import NewChatLinkIconButton from './components/NewChat/NewChatIconButton';
import SideNavHeaderIconButton from './components/SideNavToggle/SideNavToggle';

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { type, open } = useModalStore();

  const MENU_ITEMS = [
    {
      open: <NewChatLinkButton />,
      close: <NewChatLinkIconButton />,
      label: 'add link',
    },
    {
      open: <AddLinkButton onClick={() => open('ADD_LINK')} />,
      close: <AddLinkIconButton onClick={() => open('ADD_LINK')} />,
      label: 'add link',
    },
    {
      open: <AllLinkLinkButton />,
      close: <AllLinkLinkIconButton />,
      label: 'all link',
    },
  ];

  const handleSideNavToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(prev => !prev);
    e.currentTarget.blur();
  };

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 80 }} // px 단위도 가능
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="bg-gray50 fixed top-0 left-0 z-1 h-full overflow-hidden p-5 shadow-md"
      >
        <div>
          {/* 사이드 메뉴 헤더 */}
          <div className="mb-10">
            <SideNavHeaderIconButton isOpen={isOpen} onClick={handleSideNavToggle} />
          </div>

          {/* 메뉴 아이템*/}
          <nav className="flex flex-col gap-4">
            {MENU_ITEMS.map((item, i) => (
              <div key={i} className="relative h-10">
                {/* 열렸을 때 */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                >
                  {item.open}
                </motion.div>

                {/* 닫혔을 때 */}
                {!isOpen && (
                  <motion.div transition={{ duration: 1 }} className="absolute inset-0">
                    {item.close}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </motion.div>
      {type === 'ADD_LINK' && <AddLinkModal />}
    </>
  );
}
