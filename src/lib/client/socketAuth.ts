import { clientApiClient } from '@/lib/client/apiClient';
import { getClientAccessToken, getClientAuthorization } from '@/lib/client/authToken';
import { ApiError } from '@/lib/errors/ApiError';

type SocketAuthResponse = {
  success: boolean;
  data?: {
    authorization?: string;
  };
};

export type SocketAuthState =
  | {
      kind: 'authenticated';
      token: string;
      authorization: string;
    }
  | {
      kind: 'missing';
    }
  | {
      kind: 'fetch-error';
      error: Error;
    };

const parseAuthorizationToken = (authorization: string | null | undefined) => {
  if (!authorization) return null;

  const normalized = authorization.trim();
  if (!normalized) return null;

  return normalized.replace(/^Bearer\s+/i, '') || null;
};

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error(String(error ?? 'Failed to fetch socket auth.'));

export const fetchSocketAuthState = async (): Promise<SocketAuthState> => {
  const clientToken = getClientAccessToken();
  const clientAuthorization = getClientAuthorization();
  if (clientToken && clientAuthorization) {
    return {
      kind: 'authenticated',
      token: clientToken,
      authorization: clientAuthorization,
    };
  }

  try {
    const response = await clientApiClient<SocketAuthResponse>('/api/socket-auth', {
      cache: 'no-store',
    });

    if (!response.success) return { kind: 'missing' };

    const authorization = response.data?.authorization?.trim() ?? '';
    const token = parseAuthorizationToken(authorization);
    if (!authorization || !token) return { kind: 'missing' };

    return { kind: 'authenticated', token, authorization };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { kind: 'missing' };
    }

    return { kind: 'fetch-error', error: toError(error) };
  }
};

export const isSocketAuthFailure = (value: unknown) => {
  const raw =
    typeof value === 'string'
      ? value
      : value instanceof Error
        ? value.message
        : typeof value === 'object' && value !== null && 'body' in value
          ? String((value as { body?: unknown }).body ?? '')
          : String(value ?? '');

  const message = raw.toLowerCase();
  return (
    message.includes('token') ||
    message.includes('expired') ||
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('인증') ||
    message.includes('만료') ||
    message.includes('유효하지')
  );
};
