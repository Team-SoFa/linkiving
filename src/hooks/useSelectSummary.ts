import { selectNewSummary } from '@/apis/summary';
import { FetchError } from '@/hooks/util/api/error/errors';
import { updateSelectedSummary } from '@/lib/query/updateSelectedSummary';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import type { LinkSummaryFormat } from '@/types/api/linkApi';
import type { EntityId } from '@/types/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Params = {
  id: EntityId;
  summary: string;
  format: LinkSummaryFormat;
};

export default function useSelectSummary() {
  const { close } = useModalStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Params) => selectNewSummary(params),
    onSuccess: async (data, variables) => {
      await updateSelectedSummary(queryClient, variables.id, data.content);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['links'] }),
        queryClient.invalidateQueries({ queryKey: ['link', variables.id] }),
      ]);

      close();
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
