import type { ApiResponseBase } from './linkApi';

export interface ChatRoom {
  id: number;
  title: string;
  firstChat?: string;
}

export interface ChatListData {
  chats: ChatRoom[];
}

export type ChatListApiResponse = ApiResponseBase<ChatListData>;

export interface CreateChatPayload {
  firstChat: string;
}

export type CreateChatApiResponse = ApiResponseBase<ChatRoom>;

export interface ChatMessageChunk {
  chatId: number;
  content: string;
  isEnd: boolean;
}
