import { useModalStore } from '@/stores/modalStore';
import { motion } from 'framer-motion';

import AddLinkButton from './AddLinkButton';
import AddLinkModal from './AddLinkModal';
import AllLinkButton from './AllLinkButton';
import NewChatButton from './NewChatButton';

interface Props {
  isOpen: boolean;
}

const MenuSection = ({ isOpen }: Props) => {
  const { type, open } = useModalStore();

  const MENU_ITEMS = [
    { id: 'new-chat', item: <NewChatButton /> },
    { id: 'add-link', item: <AddLinkButton onClick={() => open('ADD_LINK')} /> },
    { id: 'all-link', item: <AllLinkButton /> },
  ];

  return (
    <>
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
      {type === 'ADD_LINK' && <AddLinkModal />}
    </>
  );
};

export default MenuSection;
