'use client';

import { useModalStore } from '@/stores/modalStore';
import { useSideNavStore } from '@/stores/sideNavStore';
import { motion } from 'framer-motion';

import AddLinkButton from './components/AddLink/AddLinkButton';
import AddLinkModal from './components/AddLinkModal/AddLinkModal';
import AllLinkButton from './components/AllLink/AllLinkButton';
import NewChatButton from './components/NewChat/NewChatButton';
import SideNavHeaderIconButton from './components/SideNavToggle/SideNavToggle';

export default function SideNavigation() {
  const { type, open } = useModalStore();
  const { isOpen, toggle } = useSideNavStore();

  const MENU_ITEMS = [
    { id: 'new-chat', item: <NewChatButton /> },
    { id: 'add-link', item: <AddLinkButton onClick={() => open('ADD_LINK')} /> },
    { id: 'all-link', item: <AllLinkButton /> },
  ];
  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 80 }} // px 단위도 가능
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="bg-gray50 h-screen p-5 shadow-md"
      >
        <div>
          {/* 사이드 메뉴 헤더 */}
          <div className="mb-10">
            <SideNavHeaderIconButton isOpen={isOpen} onClick={toggle} />
          </div>

          {/* 메뉴 아이템*/}
          <nav className="flex flex-col gap-4">
            {MENU_ITEMS.map(item => (
              <div key={item.id} className="relative h-10">
                {/* 열렸을 때 */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                >
                  {item.item}
                </motion.div>

                {/* 닫혔을 때 */}
                {!isOpen && (
                  <motion.div transition={{ duration: 1 }} className="absolute inset-0">
                    {!isOpen && item.item}
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
