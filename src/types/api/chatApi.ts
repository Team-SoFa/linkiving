import type { ApiResponseBase } from '@/types/api/linkApi';

export interface ChatSummary {
  id: number;
  title: string;
}

export interface ChatsRes {
  chats: ChatSummary[];
}

export type ChatsApiResponse = ApiResponseBase<ChatsRes>;

export interface CreateChatReq {
  firstChat: string;
}

export interface CreateChatRes {
  id: number;
  title: string;
  firstChat: string;
}

export type CreateChatApiResponse = ApiResponseBase<CreateChatRes>;

export type DeleteChatApiResponse = ApiResponseBase<string>;
