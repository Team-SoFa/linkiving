'use client';

import { showToast } from '@/stores/toastStore';
import type { ReportRequest } from '@/types/api/report';
import { useMutation } from '@tanstack/react-query';

type HttpError = Error & { status: number };

export default function usePostReport(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (data: ReportRequest) => {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let message = '제출에 실패했습니다.';
        try {
          const errBody = (await res.json()) as { message?: string };
          if (errBody.message) message = errBody.message;
        } catch {}

        const error: HttpError = Object.assign(new Error(message), {
          status: res.status,
        });

        throw error; // 🔴 핵심
      }

      return (await res.json()) as unknown;
    },

    onSuccess: () => {
      showToast({
        id: 'report-submit-toast',
        message: '신고가 제출되었습니다.',
        variant: 'success',
        duration: 2000,
      });
      onSuccess?.();
    },

    onError: (err: unknown) => {
      let errorMessage = '제출에 실패했습니다.';

      if (err instanceof Error && 'status' in err) {
        const status = (err as HttpError).status;

        if (status >= 500) {
          errorMessage = '서버 문제가 발생했습니다.';
        } else if (status === 401 || status === 403) {
          errorMessage = '로그인이 필요합니다.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showToast({
        id: 'report-submit-failed',
        message: errorMessage,
        variant: 'error',
        duration: 2000,
      });
    },
  });

  return {
    submit: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
