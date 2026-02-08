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

/**
 * 백엔드 직접 호출용 클라이언트
 * 백엔드 API 직접 호출 클라이언트
 * 인증이 필요한 일반 API용 (채팅, 리포트 등)
 */
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

  // 401 에러 처리 (토큰 만료 등)
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      // 클라이언트 사이드에서만 동작
      window.location.href = '/landing';
    }
    const errorData = await res.json().catch(() => ({}));
    throw new BackendApiError(401, errorData.message || 'Unauthorized', errorData);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new BackendApiError(
      res.status,
      errorData.message || `Request failed with status ${res.status}`,
      errorData
    );
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
