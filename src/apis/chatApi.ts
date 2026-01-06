import { safeFetch } from '@/hooks/util/server/safeFetch';
import { DeleteChatApiResponse } from '@/types/api/chatApi';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const CHAT_ENDPOINT = `${API_URL}/v1/chats`;

const withAuth = (init?: RequestInit): RequestInit => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${API_TOKEN}`,
    ...(init?.headers ?? {}),
  };

  return { ...init, headers };
};

export const deleteChat = async (id: number): Promise<DeleteChatApiResponse> => {
  const body = await safeFetch<DeleteChatApiResponse>(
    `${CHAT_ENDPOINT}/${id}`,
    withAuth({
      method: 'DELETE',
    })
  );
  if (!body || typeof body.success !== 'boolean' || !body.status || !body.message) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body;
};
