'use client';

import { fetchUserInfo } from '@/apis/authApi';
import { getCookieUtil, setCookieUtil } from '@/hooks/useCookie';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useUserInfo() {
  const query = useQuery<User>({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
  });

  // 사용자 정보를 받아오면 쿠키에 저장
  useEffect(() => {
    if (query.data) {
      setCookieUtil(COOKIES_KEYS.USER_INFO, JSON.stringify(query.data), { maxAge: 86400 });
    }
  }, [query.data]);

  return query;
}

/**
 * 쿠키에서 사용자 정보를 즉시 가져오기
 */
export function getUserInfoFromCookie(): User | null {
  const userInfoStr = getCookieUtil(COOKIES_KEYS.USER_INFO);
  if (!userInfoStr) return null;

  try {
    return JSON.parse(userInfoStr);
  } catch {
    return null;
  }
}
