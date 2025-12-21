export class FetchError extends Error {
  public status?: number;
  public body?: string;
  public contentType?: string | null;
  constructor(
    message: string,
    opts?: { status?: number; body?: string; contentType?: string | null }
  ) {
    super(message);
    this.name = 'FetchError';
    this.status = opts?.status;
    this.body = opts?.body;
    this.contentType = opts?.contentType ?? null;
  }
}
export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}
export class ParseError extends Error {
  public raw?: string;
  constructor(message = 'Failed to parse response', raw?: string) {
    super(message);
    this.name = 'ParseError';
    this.raw = raw;
  }
}

export interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  jsonContentTypeCheck?: boolean;
  maxResponseBytes?: number;
  maxErrorBodyBytes?: number;
}
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
      } catch (e) {
        bodyText = undefined;
      }

      console.error('[safeFetch][HTTP ERROR]', {
        url,
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: bodyText,
      });

      throw new FetchError(`Request failed with status ${res.status}`, {
        status: res.status,
        body: bodyText,
        contentType: res.headers.get('content-type'),
      });
    }

    // Content-Length 검사
    if (typeof maxResponseBytes === 'number') {
      const cl = res.headers.get('content-length');
      if (cl && !isNaN(Number(cl)) && Number(cl) > maxResponseBytes) {
        throw new FetchError(`Response too large: ${cl} bytes`, {
          contentType: res.headers.get('content-type'),
        });
      }
    }

    // Content-Type 검사
    const contentType = res.headers.get('content-type');
    if (jsonContentTypeCheck) {
      if (!contentType || !contentType.includes('application/json')) {
        const snippet = await res.text().catch(() => undefined);
        throw new FetchError('Invalid content-type, expected JSON', {
          contentType,
          body: snippet ? snippet.slice(0, maxErrorBodyBytes) : undefined,
        });
      }
    }

    // JSON 파싱
    try {
      const json = (await res.json()) as T;
      return json;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';
      let raw: string | undefined;
      try {
        raw = await res.text();
      } catch {
        raw = undefined;
      }
      throw new ParseError(
        `Failed to parse JSON response: ${msg}`,
        raw?.slice(0, maxErrorBodyBytes)
      );
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new TimeoutError(`Request to ${url} aborted after ${timeout}ms`);
    }
    if (err instanceof FetchError || err instanceof ParseError || err instanceof TimeoutError) {
      throw err;
    }
    throw new FetchError(String(err instanceof Error ? err.message : err), { contentType: null });
  } finally {
    clearTimeout(id);
  }
}
