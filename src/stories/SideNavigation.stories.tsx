import SideNavigation from '@/components/layout/SideNavigation/SideNavigation';
import { mockChats } from '@/mocks';
import { useChatStore } from '@/stores/chatStore';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';

const meta: Meta<typeof SideNavigation> = {
  title: 'Components/Layout/SideNavigation',
  component: SideNavigation,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SideNavigation>;

export const Default: Story = {};

export const WithChatRooms: Story = {
  render: () => {
    useEffect(() => {
      useChatStore.setState({
        chats: mockChats,
        activeChatId: mockChats[0]?.id ?? null,
      });

      return () => {
        useChatStore.setState({
          chats: [],
          activeChatId: null,
        });
      };
    }, []);

    return <SideNavigation />;
  },
};
