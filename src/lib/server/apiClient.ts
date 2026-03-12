import { createFetchError } from '@/hooks/util/api/error/errors';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';

import { ApiError } from '../errors/ApiError';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

if (!API_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}

export async function serverApiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;

  if (!token) {
    throw new ApiError(401, 'No authentication token');
  }

  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    cache: options.cache ?? 'no-store',
    redirect: 'manual',
    headers,
  });

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
