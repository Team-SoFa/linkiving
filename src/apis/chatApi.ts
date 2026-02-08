// 백엔드 직접 호출
import { backendApiClient } from '@/lib/client/backendClient';
import type {
  ChatListApiResponse,
  ChatRoom,
  CreateChatApiResponse,
  CreateChatPayload,
  DeleteChatApiResponse,
} from '@/types/api/chatApi';

export const fetchChats = async (): Promise<ChatRoom[]> => {
  const response = await backendApiClient<ChatListApiResponse>('/v1/chats');

  if (!response.success || !response.data) {
    throw new Error(response.message ?? 'Failed to fetch chats');
  }

  const chats = response.data.chats;

  if (!Array.isArray(chats)) {
    throw new Error('Invalid response: chats is not an array');
  }

  return chats;
};

export const createChat = async (payload: CreateChatPayload): Promise<ChatRoom> => {
  const response = await backendApiClient<CreateChatApiResponse>('/v1/chats', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? 'Failed to create chat');
  }

  return response.data;
};

export const deleteChat = async (id: number): Promise<DeleteChatApiResponse> => {
  const response = await backendApiClient<DeleteChatApiResponse>(`/v1/chats/${id}`, {
    method: 'DELETE',
  });

  if (!response.success) {
    throw new Error(response.message ?? 'Failed to delete chat');
  }

  return response;
};
