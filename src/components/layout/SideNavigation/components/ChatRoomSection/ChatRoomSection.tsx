import Label from '@/components/basics/Label/Label';
import Spinner from '@/components/basics/Spinner/Spinner';
import { useChatList } from '@/hooks/useChatList';

import ChatItem from './ChatItem';

/**
 * 스크롤은 상위(SideNavigation)의 단일 스크롤러가 담당한다.
 * 여기서 다시 overflow 를 잡으면 중첩 스크롤러가 되어 iOS 에서 터치가 갇힌다.
 *
 * DeleteChatModal 은 드로어 밖(SideNavModals)에서 렌더된다.
 */
const ChatRoomSection = () => {
  const { data: chats = [], isLoading, isError } = useChatList();

  return (
    <div className="mt-10 flex shrink-0 flex-col">
      {(isLoading || chats.length !== 0) && <Label className="mb-2 shrink-0">채팅</Label>}
      <div className="flex flex-col gap-2">
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
  );
};

export default ChatRoomSection;
