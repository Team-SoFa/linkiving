import { zodErrorToResponse } from '@/hooks/util/zodError';

import { RequestValidationError } from '../request/requestError';
import { FetchError, ParseError, TimeoutError } from './errors';

/**
 * 내부 에러를 HTTP Response로 변환하는 공통 핸들러
 * @serverOnly
 */
export function handleApiError(err: unknown): Response {
  if (err instanceof RequestValidationError) {
    return zodErrorToResponse(err.zodError);
  }

  if (err instanceof TimeoutError) {
    return Response.json({ success: false, message: 'Upstream timeout' }, { status: 504 });
  }

  if (err instanceof FetchError) {
    return Response.json(
      {
        success: false,
        message: 'Upstream request failed',
      },
      { status: err.status ?? 502 }
    );
  }

  if (err instanceof ParseError) {
    return Response.json({ success: false, message: 'Invalid upstream response' }, { status: 502 });
  }

  return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
