// 백엔드 직접 호출
import { clientApiClient } from '@/lib/client/apiClient';
import type {
  ChatHistoryApiResponse,
  ChatHistoryData,
  ChatListApiResponse,
  ChatRoom,
  CreateChatApiResponse,
  CreateChatPayload,
  DeleteChatApiResponse,
} from '@/types/api/chatApi';

export const fetchChats = async (): Promise<ChatRoom[]> => {
  const response = await clientApiClient<ChatListApiResponse>('/api/chats');

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
  const response = await clientApiClient<CreateChatApiResponse>('/api/chats', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? 'Failed to create chat');
  }

  return response.data;
};

export const deleteChat = async (id: number): Promise<DeleteChatApiResponse> => {
  const response = await clientApiClient<DeleteChatApiResponse>(`/api/chats/${id}`, {
    method: 'DELETE',
  });

  if (!response.success) {
    throw new Error(response.message ?? 'Failed to delete chat');
  }

  return response;
};

type FetchChatMessagesParams = {
  chatId: number;
  size?: number;
  lastId?: number | null;
};

export const fetchChatMessages = async ({
  chatId,
  size = 5,
  lastId,
}: FetchChatMessagesParams): Promise<ChatHistoryData> => {
  const qs = new URLSearchParams();
  qs.set('size', String(size));
  if (lastId !== undefined && lastId !== null) {
    qs.set('lastId', String(lastId));
  }

  const response = await clientApiClient<ChatHistoryApiResponse>(`/api/chats/${chatId}?${qs}`);
  if (!response.success || !response.data) {
    throw new Error(response.message ?? 'Failed to fetch chat messages');
  }

  const data = response.data;
  if (!Array.isArray(data.messages)) {
    throw new Error('Invalid response: messages is not an array');
  }

  return data;
};
