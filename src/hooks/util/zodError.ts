// 엔드포인트 책임 에러 처리
import { ZodError } from 'zod';

const ZOD_ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request payload',
  422: 'Request validation failed',
};

export function zodErrorToResponse(error: ZodError, status: 400 | 422 = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      status,
      message: ZOD_ERROR_MESSAGES[status] ?? 'Validation error',
      errors: error.flatten(),
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
