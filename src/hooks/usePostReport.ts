'use client';

import { createReport } from '@/apis/report';
import { showToast } from '@/stores/toastStore';
import type { ReportRequest } from '@/types/api/report';
import { useMutation } from '@tanstack/react-query';

import { FetchError } from './util/server/safeFetch';

export default function usePostReport(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: (data: ReportRequest) => createReport(data),

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
        if (err.status && err.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다.';
        } else if (err.status === 401 || err.status === 403) {
          errorMessage = '인증이 필요합니다.';
        } else {
          errorMessage = '제출에 실패했습니다. 다시 시도해 주세요.';
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
