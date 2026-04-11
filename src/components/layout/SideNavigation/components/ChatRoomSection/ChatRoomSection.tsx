import Label from '@/components/basics/Label/Label';
import Spinner from '@/components/basics/Spinner/Spinner';
import { useChatList } from '@/hooks/useChatList';
import { useModalStore } from '@/stores/modalStore';

import ChatItem from './ChatItem';
import DeleteChatModal from './DeleteChatModal';

const ChatRoomSection = () => {
  const { data: chats = [], isLoading, isError } = useChatList();
  const { modal } = useModalStore();

  return (
    <>
      <div className="mt-10 flex min-h-0 flex-1 flex-col">
        {(isLoading || chats.length !== 0) && <Label className="mb-2 shrink-0">채팅</Label>}
        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <p className="font-body-sm text-gray500 text-center whitespace-pre-line">
              {'채팅방을 불러오지 못했어요\n잠시 후 다시 시도해주세요'}
            </p>
          ) : (
            chats.map(chat => <ChatItem key={chat.id} id={chat.id} label={chat.title} />)
          )}
        </div>
      </div>

      {modal.type === 'DELETE_CHAT' && (
        <DeleteChatModal chatId={modal.props.chatId} title={modal.props.title} />
      )}
    </>
  );
};

export default ChatRoomSection;
