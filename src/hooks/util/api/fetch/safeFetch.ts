import {
  FetchError,
  ParseError,
  TimeoutError,
  createFetchError,
  createParseError,
  createTimeoutError,
} from '../error/errors';

export interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  jsonContentTypeCheck?: boolean;
  maxResponseBytes?: number;
  maxErrorBodyBytes?: number;
}

/**
 * 외부 API 호출 fetch 래퍼. (timeout, status, content-type, parse 에러 통합 처리)
 * @shared
 */
export async function safeFetch<T = unknown>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<T> {
  const {
    timeout = 10_000,
    jsonContentTypeCheck = true,
    maxResponseBytes,
    maxErrorBodyBytes = 1024 * 8, // 에러시에 로깅할 최대 바이트
    signal: userSignal,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  if (userSignal) {
    userSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...fetchOptions, signal: controller.signal });

    // HTTP 상태 코드 체크
    if (!res.ok) {
      let bodyText: string | undefined;
      try {
        const text = await res.text();
        bodyText = text.length > maxErrorBodyBytes ? text.slice(0, maxErrorBodyBytes) + '…' : text;
      } catch {
        bodyText = undefined;
      }
      throw createFetchError(`Request failed with status ${res.status}`, {
        status: res.status,
        body: bodyText,
        contentType: res.headers.get('content-type'),
      });
    }

    // Content-Length 검사
    if (typeof maxResponseBytes === 'number') {
      const cl = res.headers.get('content-length');
      if (cl && !isNaN(Number(cl)) && Number(cl) > maxResponseBytes) {
        throw createFetchError(`Response too large: ${cl} bytes`, {
          contentType: res.headers.get('content-type'),
        });
      }
    }

    // Content-Type 검사
    const contentType = res.headers.get('content-type');
    if (jsonContentTypeCheck) {
      if (!contentType || !contentType.includes('application/json')) {
        const snippet = await res.text().catch(() => undefined);
        throw createFetchError('Invalid content-type, expected JSON', {
          contentType,
          body: snippet ? snippet.slice(0, maxErrorBodyBytes) : undefined,
        });
      }
    }

    // JSON 파싱
    let text: string | undefined;
    try {
      text = await res.text();
      const json = JSON.parse(text) as T;
      return json;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';

      throw createParseError(
        `Failed to parse JSON response: ${msg}`,
        text?.slice(0, maxErrorBodyBytes)
      );
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw createTimeoutError(`Request to ${url} timed out`);
    }
    if (err instanceof FetchError || err instanceof ParseError || err instanceof TimeoutError) {
      throw err;
    }
    throw createFetchError('Unknown fetch error');
  } finally {
    clearTimeout(id);
  }
}
