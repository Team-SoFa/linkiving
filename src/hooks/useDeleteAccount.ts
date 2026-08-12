import { type MemberDeleteReason, deleteAccount } from '@/apis/authApi';
import { setIntentionalSessionTermination } from '@/lib/client/apiClient';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { useModalStore } from '@/stores/modalStore';
import { clearTokens } from '@/stores/tokenStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { deleteCookieUtil } from './useCookie';

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const closeModal = useModalStore(state => state.close);

  return useMutation({
    mutationFn: (deleteReason: MemberDeleteReason) => {
      setIntentionalSessionTermination(true);
      return deleteAccount(deleteReason);
    },
    onSuccess: () => {
      deleteCookieUtil(COOKIES_KEYS.ACCESS_TOKEN);
      deleteCookieUtil(COOKIES_KEYS.REFRESH_TOKEN);
      deleteCookieUtil(COOKIES_KEYS.USER_INFO);
      clearTokens();
      queryClient.clear();
      closeModal();
      router.replace('/account-deleted');
    },
    onError: () => {
      setIntentionalSessionTermination(false);
    },
  });
}
