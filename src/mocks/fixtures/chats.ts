import type {
  ChatListApiResponse,
  ChatListData,
  ChatRoom,
  CreateChatApiResponse,
} from '@/types/api/chatApi';

import { buildResponse } from '../response';

export const mockChats: ChatRoom[] = [
  { id: 201, title: '웹 접근성 요약 요청' },
  { id: 202, title: 'AI 관련 링크 찾아줘' },
  { id: 203, title: '요즘 IT 트렌드 정리' },
  { id: 204, title: '건강한 식단 링크' },
  { id: 205, title: '개발 자료 북마크' },
  { id: 206, title: '회의록 템플릿 질문' },
];

export const mockChatsData: ChatListData = {
  chats: mockChats,
};

export const mockChatsResponse: ChatListApiResponse = buildResponse(mockChatsData);

export const buildCreateChatResponse = (input: {
  id: number;
  title: string;
  firstChat: string;
}): CreateChatApiResponse => buildResponse(input, { status: '201 CREATED', message: 'Created' });
