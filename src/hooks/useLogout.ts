import { logout } from '@/apis/authApi';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { deleteCookieUtil } from './useCookie';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearCookies = () => {
    deleteCookieUtil(COOKIES_KEYS.ACCESS_TOKEN);
    deleteCookieUtil(COOKIES_KEYS.REFRESH_TOKEN);
    deleteCookieUtil(COOKIES_KEYS.USER_INFO);
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearCookies();
      queryClient.clear();
      router.push('/');
    },
    onError: () => {
      clearCookies();
      queryClient.clear();
      router.push('/');
    },
  });
}
