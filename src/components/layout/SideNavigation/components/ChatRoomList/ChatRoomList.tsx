import LinkButton from '@/components/wrappers/LinkButton/LinkButton';
import { useSideNavStore } from '@/stores/sideNavStore';

type ChatRoomItem = {
  id: number;
  title: string;
  href: string;
};

type ChatRoomListProps = {
  items: ChatRoomItem[];
  activeId?: number | null;
};

export default function ChatRoomList({ items, activeId }: ChatRoomListProps) {
  const { isOpen } = useSideNavStore();

  if (!isOpen) return null;

  return (
    <section className="mt-10">
      <p className="text-gray500 mb-3 text-xs font-semibold">채팅방</p>
      {items.length === 0 ? (
        <p className="text-gray400 text-xs">채팅방이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map(item => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <LinkButton
                  href={item.href}
                  label={item.title}
                  size="sm"
                  variant={isActive ? 'secondary' : 'tertiary_subtle'}
                  contextStyle="onPanel"
                  radius="md"
                  className="flex h-9 w-50 justify-start truncate px-3"
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
