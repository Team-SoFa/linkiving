import { zodErrorToResponse } from '@/hooks/util/zodError';
import { ApiError } from '@/lib/errors/ApiError';
import * as Sentry from '@sentry/nextjs';

import { RequestValidationError } from '../request/requestError';
import { FetchError, ParseError, TimeoutError } from './errors';

export function handleApiError(err: unknown): Response {
  if (err instanceof Error && !('sentryReported' in err)) {
    // 이미 보고된 에러인지 확인
    Sentry.captureException(err);
  }

  if (err instanceof RequestValidationError) {
    return zodErrorToResponse(err.zodError);
  }

  if (err instanceof TimeoutError) {
    return Response.json({ success: false, message: 'Upstream timeout' }, { status: 504 });
  }

  if (err instanceof FetchError) {
    return Response.json(
      { success: false, message: err.message || 'Upstream request failed' },
      { status: err.status ?? 502 }
    );
  }

  if (err instanceof ParseError) {
    return Response.json({ success: false, message: 'Invalid upstream response' }, { status: 502 });
  }

  if (err instanceof ApiError) {
    return Response.json({ success: false, message: err.message }, { status: err.status });
  }

  return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
