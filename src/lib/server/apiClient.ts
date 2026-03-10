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
  console.log('[serverApiClient] token:', token);
  console.log('[serverApiClient] endpoint:', endpoint);

  if (!token) {
    throw new ApiError(401, 'No authentication token');
  }

  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  const existingCookie = headers.get('Cookie');
  if (existingCookie) {
    const parts = existingCookie
      .split(';')
      .map(part => part.trim())
      .filter(Boolean);
    const filtered = parts.filter(part => {
      const eq = part.indexOf('=');
      if (eq < 0) return true;
      const name = part.slice(0, eq).trim();
      return name !== COOKIES_KEYS.ACCESS_TOKEN;
    });
    filtered.push(`${COOKIES_KEYS.ACCESS_TOKEN}=${token}`);
    headers.set('Cookie', filtered.join('; '));
  } else {
    headers.set('Cookie', `${COOKIES_KEYS.ACCESS_TOKEN}=${token}`);
  }

  console.log('[serverApiClient] Authorization:', headers.get('Authorization')); // TODO: 추후 삭제
  console.log('[serverApiClient] Cookie:', headers.get('Cookie')); // TODO: 추후 삭제

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    cache: options.cache ?? 'no-store',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw createFetchError(errorData.message || `Request failed`, {
      status: response.status,
    });
  }

  return response.json();
}
