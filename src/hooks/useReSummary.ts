'use client';

import { fetchNewSummary } from '@/apis/summary';
import { FetchError } from '@/hooks/util/api/error/errors';
import { showToast } from '@/stores/toastStore';
import type { LinkSummaryFormat } from '@/types/api/linkApi';
import { useMutation } from '@tanstack/react-query';

export default function useReSummary(id: number, format: LinkSummaryFormat = 'CONCISE') {
  const mutation = useMutation({
    mutationFn: () =>
      fetchNewSummary({
        id,
        format,
      }),

    onError: err => {
      let errorMessage = '요약 재생성에 실패했습니다.';

      if (err instanceof FetchError) {
        errorMessage = err.status === 500 ? '서버 오류가 발생했습니다.' : err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showToast({
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
