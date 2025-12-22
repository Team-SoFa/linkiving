'use client';

import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { safeFetch } from '../util/server/safeFetch';
import { useCookie } from './useCookie';

// TODO: User types로 통합?
interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { deleteCookie: deleteAuthToken } = useCookie(COOKIES_KEYS.AUTH_TOKEN);
  const { getCookie } = useCookie(COOKIES_KEYS.USER_INFO);
  const { deleteCookie: deleteUserInfo } = useCookie(COOKIES_KEYS.USER_INFO);

  // 사용자 정보 조회
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: () => {
      const userInfo = getCookie();
      if (!userInfo) {
        console.log('Failed to get user info');
        return null;
      }
      try {
        return JSON.parse(userInfo);
      } catch (err) {
        console.error('Failed to parse user info from cookies', err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 로그아웃 mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await safeFetch<{ success: boolean }>('/api/auth/logout', {
        method: 'POST',
        timeout: 5000,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      router.push('/');
    },
    onError: error => {
      console.error('Logout failed:', error);
      deleteAuthToken();
      deleteUserInfo();
      queryClient.setQueryData(['user'], null);
      router.push('/');
    },
  });

  const login = () => {
    window.location.href = '/api/auth/google';
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}
