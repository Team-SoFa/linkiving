'use client';

import { showToast } from '@/stores/toastStore';
import type { ReportRequest } from '@/types/api/report';
import { useMutation } from '@tanstack/react-query';

export default function usePostReport(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (data: ReportRequest) => {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || '제출에 실패했습니다.');
      }

      return res.json();
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

      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
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
