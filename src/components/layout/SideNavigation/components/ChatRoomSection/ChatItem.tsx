'use client';

import Button from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';
import { useCloseSideNavOnSelect } from '@/hooks/util/useCloseSideNavOnSelect';
import { useModalStore } from '@/stores/modalStore';
import type { EntityId } from '@/types/id';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  id: EntityId;
  label: string;
}

const ChatItem = ({ id, label }: Props) => {
  const open = useModalStore(state => state.open);
  const closeSideNav = useCloseSideNavOnSelect();
  const pathname = usePathname();

  const href = `/chat/${id}`;
  const isActive = pathname === href;

  return (
    // 더보기 버튼이 상시 노출되므로 pr 도 고정한다 (hover 마다 라벨이 밀리지 않도록)
    <div className="group bg-btn-tertiary-subtle-onpanel flex h-9 shrink-0 items-center gap-1 rounded-full pr-1 pl-3 transition-colors">
      <Link
        href={href}
        // 목록이 최대 수십 개라 뷰포트 진입 시 일괄 prefetch 가 터지는 것을 막는다
        prefetch={false}
        // 현재 열려 있는 채팅을 다시 눌러도 모바일 드로어가 닫히도록
        onClick={closeSideNav}
        aria-current={isActive ? 'page' : undefined}
        // flex 로 만들면 text-overflow 가 먹지 않는다. 행 높이(h-9)와 같은 leading 으로 수직 정렬한다.
        className="font-label-md text-gray500 group-hover:text-gray700 min-w-0 flex-1 truncate leading-9"
      >
        {label}
      </Link>
      <Popover>
        <PopoverTrigger popoverKey="chat_more">
          <IconButton
            variant="tertiary_subtle"
            contextStyle="onPanel"
            size="sm"
            icon="IC_MoreVert"
            ariaLabel={`${label} 채팅방 메뉴 더보기`}
            className="shrink-0"
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
              onClick={() => {
                close();
                open('DELETE_CHAT', { chatId: id, title: label });
                closeSideNav();
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatItem;
