import Label from '@/components/basics/Label/Label';
import { useModalStore } from '@/stores/modalStore';

import ChatItem from './ChatItem';
import DeleteChatModal from './DeleteChatModal';

const ChatRoomSection = () => {
  const { type, props } = useModalStore();
  return (
    <>
      <div className="mt-10 flex min-h-0 flex-1 flex-col">
        <Label className="mb-2 shrink-0">채팅</Label>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <ChatItem id={1} label="어쩌구저쩌궁ㄹㅇㄹ아러ㅣ라ㅓ이ㅏ러나ㅣ러나이런아ㅣ런알" />
          <ChatItem id={2} label="어쩌구저쩌궁ㄹㅇㄹ아러ㅣ라ㅓ이ㅏ러나ㅣ러나이런아ㅣ런알" />
          <ChatItem id={3} label="어쩌구저쩌궁ㄹㅇㄹ아러ㅣ라ㅓ이ㅏ러나ㅣ러나이런아ㅣ런알" />
          <ChatItem id={4} label="어쩌구저쩌궁ㄹㅇㄹ아러ㅣ라ㅓ이ㅏ러나ㅣ러나이런아ㅣ런알" />
        </div>
      </div>

      {type === 'DELETE_CHAT' && typeof props?.chatId === 'number' && (
        <DeleteChatModal chatId={props.chatId} />
      )}
    </>
  );
};

export default ChatRoomSection;
