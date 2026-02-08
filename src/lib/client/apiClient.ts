import { ApiError } from '../errors/ApiError';

/**
 * 클라이언트 API 클라이언트 (인증용)
 * 클라이언트 사이드 API 클라이언트
 * BFF API Routes 호출용
 */
export async function clientApiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      errorData.error || errorData.message || `Request failed with status ${res.status}`,
      errorData
    );
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
