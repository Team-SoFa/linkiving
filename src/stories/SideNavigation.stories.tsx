import SideNavigation from '@/components/layout/SideNavigation/SideNavigation';
import { mockChats } from '@/mocks/fixtures/chats';
import { useSideNavStore } from '@/stores/sideNavStore';
import type { User } from '@/types/user';
import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockUser: User = {
  id: 'mock-user-1',
  name: '방다연',
  profileImageUrl: '',
  email: 'user@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const buildSeededClient = (chatCount: number) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  client.setQueryData(['chats'], mockChats.slice(0, chatCount));
  client.setQueryData(['userInfo'], mockUser);
  return client;
};

/**
 * SideNavigation 은 앱 셸(h-dvh + overflow-hidden) 안에서만 올바른 높이를 갖는다.
 * 래퍼가 없으면 데스크톱의 `sticky h-full` 패널이 0 높이로 렌더된다.
 */
const withAppShell =
  (chatCount: number): Decorator =>
  Story => (
    <QueryClientProvider client={buildSeededClient(chatCount)}>
      <div className="flex h-dvh overflow-hidden bg-white">
        <Story />
        <main className="min-w-0 flex-1" />
      </div>
    </QueryClientProvider>
  );

const withSideNavOpen =
  (isOpen: boolean): Decorator =>
  Story => {
    useSideNavStore.setState({ isOpen });
    return <Story />;
  };

const meta: Meta<typeof SideNavigation> = {
  title: 'Components/Layout/SideNavigation',
  component: SideNavigation,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SideNavigation>;

export const DesktopExpanded: Story = {
  decorators: [withSideNavOpen(true), withAppShell(6)],
};

export const DesktopCollapsed: Story = {
  decorators: [withSideNavOpen(false), withAppShell(6)],
};

export const MobileDrawerClosed: Story = {
  globals: { viewport: { value: 'mobile1' } },
  decorators: [withSideNavOpen(false), withAppShell(6)],
};

export const MobileDrawerOpen: Story = {
  globals: { viewport: { value: 'mobile1' } },
  decorators: [withSideNavOpen(true), withAppShell(6)],
};

/**
 * 짧은 뷰포트 + 긴 채팅 목록 = 내비 스크롤 회귀 가드.
 * 메뉴/목록 전체가 스크롤로 도달 가능해야 하고, 하단 프로필 행은 항상 고정되어 있어야 한다.
 */
export const MobileShortViewport: Story = {
  globals: {
    viewport: {
      value: 'shortMobile',
      isRotated: false,
    },
  },
  parameters: {
    viewport: {
      options: {
        shortMobile: {
          name: 'Short mobile (landscape-ish)',
          styles: { width: '375px', height: '420px' },
          type: 'mobile',
        },
      },
    },
  },
  decorators: [withSideNavOpen(true), withAppShell(mockChats.length)],
};
