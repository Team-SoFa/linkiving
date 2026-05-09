import { useModalStore } from '@/stores/modalStore';

import AddLinkModal from './AddLink';
import AddLinkButton from './AddLink/AddLinkButton';
import AllLinkButton from './AllLinkButton';
import NewChatButton from './NewChatButton';

const MenuSection = () => {
  const { modal, open } = useModalStore();

  const MENU_ITEMS = [
    { id: 'new-chat', item: <NewChatButton /> },
    { id: 'add-link', item: <AddLinkButton onClick={() => open('ADD_LINK')} /> },
    { id: 'all-link', item: <AllLinkButton /> },
  ];

  return (
    <>
      <nav className="flex flex-col gap-4">
        {MENU_ITEMS.map(item => (
          <div key={item.id} className="h-10">
            {item.item}
          </div>
        ))}
      </nav>
      {modal.type === 'ADD_LINK' && <AddLinkModal />}
    </>
  );
};

export default MenuSection;
