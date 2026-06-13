import type { EntityId } from '@/types/id';

import type { ApiResponseBase } from './linkApi';

export interface ChatRoom {
  id: EntityId;
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
  chatId: EntityId;
  content: string;
  isEnd: boolean;
}

export interface ChatHistoryLink {
  id: EntityId;
  url: string;
  title: string;
  imageUrl?: string | null;
  summary?: string | null;
}

export interface ChatHistoryMessage {
  id: EntityId;
  content: string;
  type: string;
  feedback?: string | null;
  time?: string | null;
  links?: ChatHistoryLink[] | null;
}

export interface ChatHistoryData {
  messages: ChatHistoryMessage[];
  hasNext: boolean;
  lastId: EntityId | null;
}

export type ChatHistoryApiResponse = ApiResponseBase<ChatHistoryData>;

export type FeedbackSentiment = 'LIKE' | 'DISLIKE' | 'NONE';

export interface AddMessageFeedbackPayload {
  sentiment: FeedbackSentiment;
  text?: string;
}

export interface AddMessageFeedbackData {
  id: EntityId;
}

export type AddMessageFeedbackApiResponse = ApiResponseBase<AddMessageFeedbackData>;
