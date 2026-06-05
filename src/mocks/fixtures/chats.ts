import type {
  ChatListApiResponse,
  ChatListData,
  ChatRoom,
  CreateChatApiResponse,
} from '@/types/api/chatApi';

import { buildResponse } from '../response';

export const mockChats: ChatRoom[] = [
  { id: '', title: '웹 접근성 요약 요청' },
  { id: '', title: 'AI 관련 링크 찾아줘' },
  { id: '', title: '요즘 IT 트렌드 정리' },
  { id: '', title: '건강한 식단 링크' },
  { id: '', title: '개발 자료 북마크' },
  { id: '', title: '회의록 템플릿 질문' },
].map((chat, index) => ({
  ...chat,
  id: `mock-chat-${index + 1}`,
}));

export const mockChatsData: ChatListData = {
  chats: mockChats,
};

export const mockChatsResponse: ChatListApiResponse = buildResponse(mockChatsData);

export const buildCreateChatResponse = (input: {
  id: string;
  title: string;
  firstChat: string;
}): CreateChatApiResponse => buildResponse(input, { status: '201 CREATED', message: 'Created' });
