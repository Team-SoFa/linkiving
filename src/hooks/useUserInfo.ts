'use client';

import { fetchUserInfo } from '@/apis/authApi';
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export function useUserInfo() {
  const query = useQuery<User>({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
  });

  return query;
}
