import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';

import { ApiError } from '../errors/ApiError';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // TODO: 환경변수 논의 후 BASE_API_URL로 변경

if (!API_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}

/**
 * 서버 사이드 API 클라이언트
 * Next.js API Routes에서만 사용
 */
export async function serverApiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies(); // await 추가
  const token = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;

  if (!token) {
    throw new ApiError(401, 'No authentication token');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `Request failed with status ${response.status}`,
      errorData
    );
  }

  return response.json();
}
