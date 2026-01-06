'use client';

import Button from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';
import { useModalStore } from '@/stores/modalStore';
import { useRouter } from 'next/navigation';

interface Props {
  id: number;
  label: string;
}

const ChatItem = ({ id, label }: Props) => {
  const router = useRouter();
  const { open } = useModalStore();

  const handleItemClick = () => {
    router.push(`/chat/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="group bg-btn-tertiary-subtle-onpanel flex h-9 w-50 cursor-pointer items-center justify-between rounded-full pr-3 pl-3 transition-colors hover:pr-1"
        onClick={handleItemClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="font-label-md text-gray500 group-hover:text-gray700 truncate group-hover:w-46">
          {label}
        </span>
        <Popover>
          <PopoverTrigger popoverKey="chat_more">
            <IconButton
              variant="tertiary_subtle"
              contextStyle="onPanel"
              size="sm"
              icon="IC_MoreVert"
              ariaLabel="채팅방 메뉴 더보기 버튼"
              className="hidden pl-1 group-hover:block"
              onClick={handleButtonClick}
            />
          </PopoverTrigger>
          <PopoverContent popoverKey="chat_more">
            {close => (
              <Button
                label="채팅 삭제"
                icon="IC_Delete"
                variant="tertiary_subtle"
                contextStyle="onPanel"
                size="sm"
                radius="full"
                className="m-3 pr-13"
                onClick={e => {
                  e.stopPropagation();
                  close();
                  open('DELETE_CHAT', { chatId: id });
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default ChatItem;
