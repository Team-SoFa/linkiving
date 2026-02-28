import { ApiError } from '../errors/ApiError';

/**
 * 클라이언트 API 클라이언트 (인증용)
 * 클라이언트 사이드 API 클라이언트
 * BFF API Routes 호출용
 */
export async function clientApiClient<T>(
  endpoint: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 15_000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException(`Request timed out after ${timeout}ms`, 'TimeoutError'));
  }, timeout);

  try {
    const res = await fetch(endpoint, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      signal: fetchOptions.signal ?? controller.signal,
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
  } finally {
    clearTimeout(timeoutId);
  }
}
