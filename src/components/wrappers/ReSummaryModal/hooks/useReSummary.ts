'use client';

import { fetchNewSummary } from '@/apis/summary';
import { FetchError } from '@/hooks/util/api/error/errors';
import { showToast } from '@/stores/toastStore';
import { ReSummaryRequest } from '@/types/api/summaryApi';
import { useMutation } from '@tanstack/react-query';

type Format = ReSummaryRequest['format'];

export default function useReSummary(id: number, format: Format = 'DETAILED') {
  const mutation = useMutation({
    mutationFn: () =>
      fetchNewSummary({
        id,
        format,
      }),

    onSuccess: () => {
      showToast({
        id: 'resummary-success',
        message: '요약이 업데이트 되었습니다.',
        variant: 'success',
      });
    },
    onError: err => {
      let errorMessage = '요약 업데이트에 실패했습니다.';

      if (err instanceof FetchError) {
        errorMessage = err.status === 500 ? '서버 오류가 발생했습니다.' : err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showToast({
        id: 'resummary-failed',
        message: errorMessage,
        variant: 'error',
      });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
