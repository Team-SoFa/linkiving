'use client';

import { showToast } from '@/stores/toastStore';
import { useMutation } from '@tanstack/react-query';

import { FetchError } from './util/server/safeFetch';
import { safeFetch } from './util/server/safeFetch';

interface ReportReauest {
  content: string;
}

export default function usePostReport(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (data: ReportReauest) => {
      return await safeFetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        timeout: 10000,
      });
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
    onError: err => {
      let errorMessage = '제출에 실패했습니다.';

      if (err instanceof FetchError) {
        errorMessage = err.status === 500 ? '서버 오류가 발생했습니다.' : err.message;
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
