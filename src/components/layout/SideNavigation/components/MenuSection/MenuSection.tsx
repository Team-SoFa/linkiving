import { useCloseSideNavOnSelect } from '@/hooks/util/useCloseSideNavOnSelect';
import { useModalStore } from '@/stores/modalStore';

import AddLinkButton from './AddLink/AddLinkButton';
import AllLinkButton from './AllLinkButton';
import NewChatButton from './NewChatButton';

const MenuSection = () => {
  const open = useModalStore(state => state.open);
  const closeSideNav = useCloseSideNavOnSelect();

  const MENU_ITEMS = [
    { id: 'new-chat', item: <NewChatButton /> },
    {
      id: 'add-link',
      item: (
        <AddLinkButton
          onClick={() => {
            open('ADD_LINK');
            closeSideNav();
          }}
        />
      ),
    },
    { id: 'all-link', item: <AllLinkButton /> },
  ];

  // AddLinkModal 은 드로어 밖(SideNavModals)에서 렌더된다.
  // 여기서 렌더하면 "선택 후 드로어 닫기"가 모달까지 언마운트시킨다.
  return (
    <nav className="flex shrink-0 flex-col gap-4">
      {MENU_ITEMS.map(item => (
        <div key={item.id} className="h-10 shrink-0">
          {item.item}
        </div>
      ))}
    </nav>
  );
};

export default MenuSection;
