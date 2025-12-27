import { create } from 'zustand';

type MessageRole = 'user' | 'ai' | 'system';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
};

type ChatState = {
  messages: ChatMessage[];
  isConnected: boolean;
  isGenerating: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastAiMessage: (content: string) => void;
  setConnected: (connected: boolean) => void;
  setGenerating: (generating: boolean) => void;
  clearMessages: () => void;
};

export type ChatStoreState = ChatState;

export const useChatStore = create<ChatState>(set => ({
  messages: [],
  isConnected: false,
  isGenerating: false,
  addMessage: msg => set(state => ({ messages: [...state.messages, msg] })),
  updateLastAiMessage: content =>
    set(state => {
      const lastMsg = state.messages[state.messages.length - 1];
      if (lastMsg && lastMsg.role === 'ai') {
        const updated = [...state.messages];
        const nextContent = lastMsg.content === '...' ? content : lastMsg.content + content;
        updated[updated.length - 1] = { ...lastMsg, content: nextContent };
        return { messages: updated };
      }
      return state;
    }),
  setConnected: connected => set({ isConnected: connected }),
  setGenerating: generating => set({ isGenerating: generating }),
  clearMessages: () => set({ messages: [] }),
}));

// import { mockChats } from '@/mocks';
// import type { ChatSummary } from '@/types/api/chatApi';
// import { create } from 'zustand';
// type ChatStoreState = {
//   chats: ChatSummary[];
//   activeChatId: number | null;
//   setChats: (chats: ChatSummary[]) => void;
//   addChat: (chat: ChatSummary) => void;
//   removeChat: (id: number) => void;
//   setActiveChat: (id: number | null) => void;
// };
// const useMockData = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
// export const useChatStore = create<ChatStoreState>(set => ({
//   chats: useMockData ? mockChats : [],
//   activeChatId: null,
//   setChats: chats => set({ chats }),
//   addChat: chat =>
//     set(state => ({
//       chats: [chat, ...state.chats],
//     })),
//   removeChat: id =>
//     set(state => ({
//       chats: state.chats.filter(chat => chat.id !== id),
//       activeChatId: state.activeChatId === id ? null : state.activeChatId,
//     })),
//   setActiveChat: id => set({ activeChatId: id }),
// }));
