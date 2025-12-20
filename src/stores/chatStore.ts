import { mockChats } from '@/mocks';
import type { ChatSummary } from '@/types/api/chatApi';
import { create } from 'zustand';

type ChatStoreState = {
  chats: ChatSummary[];
  activeChatId: number | null;
  setChats: (chats: ChatSummary[]) => void;
  addChat: (chat: ChatSummary) => void;
  removeChat: (id: number) => void;
  setActiveChat: (id: number | null) => void;
};

const useMockData = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const useChatStore = create<ChatStoreState>(set => ({
  chats: useMockData ? mockChats : [],
  activeChatId: null,
  setChats: chats => set({ chats }),
  addChat: chat =>
    set(state => ({
      chats: [chat, ...state.chats],
    })),
  removeChat: id =>
    set(state => ({
      chats: state.chats.filter(chat => chat.id !== id),
      activeChatId: state.activeChatId === id ? null : state.activeChatId,
    })),
  setActiveChat: id => set({ activeChatId: id }),
}));
