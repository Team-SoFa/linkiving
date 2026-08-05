'use client';

import { fetchUserInfo } from '@/apis/authApi';
import { agreeTerms } from '@/apis/termsApi';
import { trackGoogleSignUp } from '@/lib/client/signUpAnalytics';
import { useToastStore } from '@/stores/toastStore';
import type { TermsAgreementRequest } from '@/types/api/termsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useTermsAgreementSubmit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const mutation = useMutation({
    mutationFn: (data: TermsAgreementRequest) => agreeTerms(data),
    retry: false,
    onSuccess: async () => {
      let gaUserId: string | null = null;

      try {
        const user = await fetchUserInfo();
        queryClient.setQueryData(['userInfo'], user);
        gaUserId = user.id;
      } catch {
        void queryClient.invalidateQueries({ queryKey: ['userInfo'] });
      }

      trackGoogleSignUp(gaUserId);

      showToast({
        id: 'alert',
        message: '\uc57d\uad00 \ub3d9\uc758\uac00 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4.',
        variant: 'success',
        duration: 2000,
      });
      router.refresh();
      router.push('/home');
    },
    onError: () => {
      showToast({
        id: 'alert',
        message:
          '\uc57d\uad00 \ub3d9\uc758 \ucc98\ub9ac\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.',
        variant: 'error',
        duration: 2000,
      });
    },
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
  };
}
