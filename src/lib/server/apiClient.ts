import { createFetchError } from '@/hooks/util/api/error/errors';
import { isExpiredJwt } from '@/lib/auth/jwt';
import {
  AuthTokenData,
  TokenResponse,
  extractAuthTokens,
  getAuthCookieOptions,
} from '@/lib/auth/token';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';

import { ApiError } from '../errors/ApiError';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const AUTH_REFRESH_ENDPOINT = process.env.AUTH_REFRESH_ENDPOINT ?? '/v1/auth/reissue';

if (!API_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}

const refreshAccessToken = async (refreshToken: string): Promise<AuthTokenData | null> => {
  const response = await fetch(`${API_BASE_URL}${AUTH_REFRESH_ENDPOINT}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Cookie: `${COOKIES_KEYS.REFRESH_TOKEN}=${encodeURIComponent(refreshToken)}`,
    },
  });

  if (!response.ok) return null;

  const tokenResponse = (await response.json().catch(() => null)) as TokenResponse;
  const tokens = extractAuthTokens(tokenResponse, response.headers);
  if (!tokens) return null;

  const cookieStore = await cookies();
  cookieStore.set(
    COOKIES_KEYS.ACCESS_TOKEN,
    tokens.accessToken,
    getAuthCookieOptions(tokens.accessToken)
  );

  if (tokens.refreshToken) {
    cookieStore.set(
      COOKIES_KEYS.REFRESH_TOKEN,
      tokens.refreshToken,
      getAuthCookieOptions(tokens.refreshToken)
    );
  }

  return tokens;
};

export const getValidAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIES_KEYS.REFRESH_TOKEN)?.value;

  if (accessToken && !isExpiredJwt(accessToken)) {
    return accessToken;
  }

  if (!refreshToken) {
    return accessToken ?? null;
  }

  const refreshedTokens = await refreshAccessToken(refreshToken);
  return refreshedTokens?.accessToken ?? accessToken ?? null;
};

const fetchWithAuth = async (endpoint: string, options: RequestInit, token: string) => {
  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    cache: options.cache ?? 'no-store',
    redirect: 'manual',
    headers,
  });
};

export async function serverApiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getValidAccessToken();

  if (!token) {
    throw new ApiError(401, 'No authentication token');
  }

  let response = await fetchWithAuth(endpoint, options, token);

  if (response.status === 401) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(COOKIES_KEYS.REFRESH_TOKEN)?.value;
    const refreshedTokens = refreshToken ? await refreshAccessToken(refreshToken) : null;

    if (refreshedTokens?.accessToken) {
      response = await fetchWithAuth(endpoint, options, refreshedTokens.accessToken);
    }
  }

  // 리디렉션 발생 시 Authorization 헤더가 제거되므로 명시적으로 에러 처리
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const rawLocation = response.headers.get('location');
    const safeLocation = rawLocation ? new URL(rawLocation, API_BASE_URL) : null;

    console.error('[serverApiClient] Redirect detected', {
      status: response.status,
      location: safeLocation ? `${safeLocation.origin}${safeLocation.pathname}` : null,
    });
    throw createFetchError('Unexpected redirect from upstream API', { status: 502 });
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    const rawBody = await response.text();

    let message = 'Request failed';
    if (contentType?.includes('application/json')) {
      try {
        const errorData = JSON.parse(rawBody || '{}');
        message = errorData.message || message;
      } catch {
        // JSON 파싱 실패 시 기본 메시지 유지
      }
    }

    throw createFetchError(message, {
      status: response.status,
      body: rawBody,
      contentType,
    });
  }

  return response.json();
}
