import type { ApiResponseBase } from '@/types/api/linkApi';

type Status = '200 OK' | '201 CREATED' | '400 BAD_REQUEST' | '500 INTERNAL_SERVER_ERROR';

export const buildResponse = <T>(
  data: T,
  opts?: {
    success?: boolean;
    status?: Status;
    message?: string;
    timestamp?: string;
  }
): ApiResponseBase<T> => {
  const now = new Date().toISOString();

  return {
    success: opts?.success ?? true,
    status: opts?.status ?? '200 OK',
    message: opts?.message ?? 'OK',
    data,
    timestamp: opts?.timestamp ?? now,
  };
};
