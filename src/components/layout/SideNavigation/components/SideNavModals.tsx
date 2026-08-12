'use client';

import AccountDeleteModal from '@/components/wrappers/AccountDeleteModal/AccountDeleteModal';
import { useModalStore } from '@/stores/modalStore';

import DeleteChatModal from './ChatRoomSection/DeleteChatModal';
import AddLinkModal from './MenuSection/AddLink';

/**
 * SideNavigation 이 소유하지만 렌더 위치는 드로어 밖이어야 하는 모달들.
 *
 * 드로어 서브트리 안에 두면 "메뉴 선택 후 드로어 닫기"가 방금 연 모달까지
 * 함께 언마운트시켜 모바일에서 모달이 깜빡이고 사라진다.
 */
export default function SideNavModals() {
  const modal = useModalStore(state => state.modal);

  return (
    <>
      {modal.type === 'ADD_LINK' && <AddLinkModal />}
      {modal.type === 'DELETE_CHAT' && (
        <DeleteChatModal chatId={modal.props.chatId} title={modal.props.title} />
      )}
      {modal.type === 'ACCOUNT_DELETE' && <AccountDeleteModal />}
    </>
  );
}
