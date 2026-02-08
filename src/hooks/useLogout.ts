'use client';

import { logout } from '@/apis/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push('/');
    },
    onError: () => {
      queryClient.clear();
      // 에러가 나도 로그인 페이지로 이동
      router.push('/');
    },
  });
}
