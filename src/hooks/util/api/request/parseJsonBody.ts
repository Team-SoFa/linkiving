import { NextRequest } from 'next/server';

import { ParseError } from '../error/errors';

/**
 * request 시 JSON body를 안전하게 파싱(실패 시, 표준 API 에러 throw)
 * @serverOnly
 */
export async function parseJsonBody<T = unknown>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch (err) {
    throw new ParseError('INVALID_JSON_BODY');
  }
}
