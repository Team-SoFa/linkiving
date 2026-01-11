export class FetchError extends Error {
  status?: number;
  body?: string;
  contentType: string | null;

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
  raw?: string;

  constructor(message = 'Failed to parse response', raw?: string) {
    super(message);
    this.name = 'ParseError';
    this.raw = raw;
  }
}

/* ===== 생성 함수 ===== */

export const createFetchError = (
  message: string,
  opts?: { status?: number; body?: string; contentType?: string | null }
) => new FetchError(message, opts);

export const createTimeoutError = (message?: string) => new TimeoutError(message);

export const createParseError = (message?: string, raw?: string) => new ParseError(message, raw);
