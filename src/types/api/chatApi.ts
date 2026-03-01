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

export type DeleteChatApiResponse = ApiResponseBase<null>;

export interface ChatMessageChunk {
  chatId: number;
  content: string;
  isEnd: boolean;
}

export interface ChatHistoryLink {
  id: number;
  url: string;
  title: string;
  imageUrl?: string | null;
  summary?: string | null;
}

export interface ChatHistoryMessage {
  id: number;
  content: string;
  type: string;
  feedback?: string | null;
  time?: string | null;
  links?: ChatHistoryLink[] | null;
}

export interface ChatHistoryData {
  messages: ChatHistoryMessage[];
  hasNext: boolean;
  lastId: number | null;
}

export type ChatHistoryApiResponse = ApiResponseBase<ChatHistoryData>;
