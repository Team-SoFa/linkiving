'use client';

import { showToast } from '@/stores/toastStore';
import { useMutation } from '@tanstack/react-query';

import { FetchError } from './util/server/safeFetch';
import { safeFetch } from './util/server/safeFetch';

interface ReportRequest {
  content: string;
}

export default function usePostReport(onSuccess?: () => void) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const mutation = useMutation({
    mutationFn: async (data: ReportRequest) => {
      return await safeFetch(`${API_BASE_URL}/v1/reports`, {
        // TODO: 백엔드 업로드 및 env 작성 후 엔드포인트 수정
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
