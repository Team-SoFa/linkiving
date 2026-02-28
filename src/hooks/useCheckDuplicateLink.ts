import { checkDuplicateLink } from '@/apis/linkApi';
import { useMutation } from '@tanstack/react-query';

interface DuplicateResult {
  exists: boolean;
  linkId?: number;
}

export const useDuplicateLinkMutation = () => {
  return useMutation<DuplicateResult, Error, string>({
    mutationFn: async (url: string) => {
      return await checkDuplicateLink(url);
    },
  });
};
