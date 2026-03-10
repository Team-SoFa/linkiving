// TODO: sentry 중복 보고 발생 여부 확인 필요
import * as Sentry from '@sentry/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // TODO: 환경변수 논의 후 BASE_API_URL로 변경

export class BackendApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'BackendApiError';
  }
}

export async function backendApiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/landing';
    }
    const errorData = await res.json().catch(() => ({}));
    const err = new BackendApiError(401, errorData.message || 'Unauthorized', errorData);
    Sentry.captureException(err, { extra: { endpoint } });
    throw err;
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const err = new BackendApiError(
      res.status,
      errorData.message || `Request failed with status ${res.status}`,
      errorData
    );
    Sentry.captureException(err, { extra: { endpoint, status: res.status } });
    throw err;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
