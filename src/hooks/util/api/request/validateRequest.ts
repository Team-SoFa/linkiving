import type { ZodSchema } from 'zod';

import { RequestValidationError } from './requestError';

/**
 * 요청 payload를 Zod 스키마로 검증 (실패 시, 표준 API 에러 throw)
 * @serverOnly
 */
export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new RequestValidationError(parsed.error);
  }

  return parsed.data;
}
