import { selectNewSummary } from '@/apis/summary';
import { FetchError } from '@/hooks/util/api/error/errors';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import type { LinkSummaryFormat } from '@/types/api/linkApi';
import { useMutation } from '@tanstack/react-query';

type Params = {
  id: number;
  summary: string;
  format: LinkSummaryFormat;
};

export default function useSelectSummary() {
  const { close } = useModalStore();

  return useMutation({
    mutationFn: (params: Params) => selectNewSummary(params),
    onSuccess: () => {
      close();
      showToast({
        message: '새로운 요약을 저장했습니다.',
        variant: 'success',
      });
    },
    onError: err => {
      let errorMessage = '요약 저장에 실패했습니다.';
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
}
