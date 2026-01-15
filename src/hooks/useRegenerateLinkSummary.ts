import { regenerateLinkSummary } from '@/apis/linkApi';
import type { LinkSummaryFormat, LinkSummaryRegenerateData } from '@/types/api/linkApi';
import { useMutation } from '@tanstack/react-query';

type SummaryParams = {
  id: number;
  format: LinkSummaryFormat;
};

export function useRegenerateLinkSummary() {
  return useMutation<LinkSummaryRegenerateData, Error, SummaryParams>({
    mutationFn: ({ id, format }) => regenerateLinkSummary(id, format),
  });
}
