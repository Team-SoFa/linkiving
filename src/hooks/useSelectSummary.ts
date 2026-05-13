import { selectNewSummary } from '@/apis/summary';
import { FetchError } from '@/hooks/util/api/error/errors';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import type { LinkListViewData, LinkSummaryFormat } from '@/types/api/linkApi';
import type { Link } from '@/types/link';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

type Params = {
  id: number;
  summary: string;
  format: LinkSummaryFormat;
};

export default function useSelectSummary() {
  const { close } = useModalStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Params) => selectNewSummary(params),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData<Link>(['link', variables.id], prev =>
        prev
          ? {
              ...prev,
              summary: data.content,
              summaryStatus: 'ready',
              summaryErrorMessage: undefined,
              summaryProgress: undefined,
            }
          : prev
      );

      queryClient.setQueriesData<InfiniteData<LinkListViewData>>({ queryKey: ['links'] }, prev => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map(page => ({
            ...page,
            content: page.content.map(link =>
              link.id === variables.id
                ? {
                    ...link,
                    summary: data.content,
                    summaryStatus: 'ready',
                    summaryErrorMessage: undefined,
                    summaryProgress: undefined,
                  }
                : link
            ),
          })),
        };
      });

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
