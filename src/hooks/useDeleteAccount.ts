import { type MemberDeleteReason, deleteAccount } from '@/apis/authApi';
import { setIntentionalSessionTermination } from '@/lib/client/apiClient';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { useModalStore } from '@/stores/modalStore';
import { clearTokens } from '@/stores/tokenStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCookieUtil } from './useCookie';

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const closeModal = useModalStore(state => state.close);

  return useMutation({
    mutationFn: async (deleteReason: MemberDeleteReason) => {
      setIntentionalSessionTermination(true);

      try {
        await deleteAccount(deleteReason);
      } catch (error) {
        setIntentionalSessionTermination(false);
        throw error;
      }
    },
    onSuccess: () => {
      deleteCookieUtil(COOKIES_KEYS.ACCESS_TOKEN);
      deleteCookieUtil(COOKIES_KEYS.REFRESH_TOKEN);
      deleteCookieUtil(COOKIES_KEYS.USER_INFO);
      clearTokens();
      queryClient.clear();
      closeModal();
      window.location.replace('/account-deleted');
    },
  });
}
