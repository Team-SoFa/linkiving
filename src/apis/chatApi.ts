import { type SafeFetchOptions, safeFetch } from '@/hooks/util/api/fetch/safeFetch';
import type {
  ChatListApiResponse,
  ChatRoom,
  CreateChatApiResponse,
  CreateChatPayload,
  DeleteChatApiResponse,
} from '@/types/api/chatApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

if (!API_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}

if (!API_TOKEN) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_TOKEN');
}

const buildUrl = (...paths: string[]) => `${API_BASE_URL}${paths.join('')}`;

const authHeaderValue = () => `Bearer ${API_TOKEN}`;

const withAuth = (init?: SafeFetchOptions): SafeFetchOptions => {
  const headers: HeadersInit = {
    Authorization: authHeaderValue(),
    ...(init?.headers ?? {}),
  };

  return {
    timeout: 15_000,
    jsonContentTypeCheck: true,
    ...init,
    headers,
  };
};

const CHATS_ENDPOINT = buildUrl('/v1/chats');

export const fetchChats = async (): Promise<ChatRoom[]> => {
  const body = await safeFetch<ChatListApiResponse>(
    CHATS_ENDPOINT,
    withAuth({ cache: 'no-store' })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  const chats = body.data.chats;

  if (!Array.isArray(chats)) {
    throw new Error('Invalid response: chats is not an array');
  }

  return chats;
};

export const createChat = async (payload: CreateChatPayload): Promise<ChatRoom> => {
  const body = await safeFetch<CreateChatApiResponse>(
    CHATS_ENDPOINT,
    withAuth({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body.data;
};

export const deleteChat = async (id: number): Promise<DeleteChatApiResponse> => {
  const body = await safeFetch<DeleteChatApiResponse>(
    `${CHATS_ENDPOINT}/${id}`,
    withAuth({
      method: 'DELETE',
    })
  );
  if (!body || typeof body.success !== 'boolean' || !body.status || !body.message) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body;
};
