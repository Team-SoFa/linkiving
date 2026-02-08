'use client';

import { useCallback, useEffect, useState } from 'react';

interface CookieOptions {
  maxAge?: number; // 초 단위
  days?: number; // 일 단위
  secure?: boolean;
  path?: string;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * 쿠키 가져오기 유틸리티 함수 (클라이언트 전용, 서버에서는 항상 null 반환))
 */
export const getCookieUtil = (key: string): string | null => {
  if (typeof window === 'undefined') return null;

  const cookie = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));

  if (!cookie) return null;
  const value = cookie.substring(key.length + 1);

  return value ? decodeURIComponent(value) : null;
};

/**
 * 쿠키 설정 유틸리티 함수
 */
export const setCookieUtil = (key: string, value: string, options: CookieOptions = {}) => {
  if (typeof window === 'undefined') return;

  const { maxAge, days = 7, secure: secureOption, path = '/', sameSite = 'Lax' } = options;
  const secure =
    secureOption ?? (sameSite === 'None' ? true : process.env.NODE_ENV === 'production');
  let cookieString = `${key}=${encodeURIComponent(value)}`;

  // maxAge 또는 days 중 하나만 사용
  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  } else {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  cookieString += `; path=${path}`;
  cookieString += `; SameSite=${sameSite}`;
  if (secure) cookieString += '; Secure';

  document.cookie = cookieString;
};

/**
 * 쿠키 삭제 유틸리티 함수
 */
export const deleteCookieUtil = (
  key: string,
  path: string = '/',
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax'
) => {
  if (typeof window === 'undefined') return;

  const shouldBeSecure = sameSite === 'None' ? true : window.location.protocol === 'https:';
  const secureFlag = shouldBeSecure ? ';Secure' : '';

  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};SameSite=${sameSite}${secureFlag}`;
};

/**
 * 쿠키 관리 훅
 */
export function useCookie(key: string) {
  const getCookie = useCallback((): string | null => {
    return getCookieUtil(key);
  }, [key]);

  const [cookie, setCookieState] = useState<string | null>(null);

  useEffect(() => {
    setCookieState(getCookie());
  }, [getCookie]);

  const setCookie = useCallback(
    (value: string, options: CookieOptions = {}) => {
      setCookieUtil(key, value, options);
      setCookieState(value);
    },
    [key]
  );

  const deleteCookie = useCallback(
    (path: string = '/') => {
      deleteCookieUtil(key, path);
      setCookieState(null);
    },
    [key]
  );

  return { cookie, setCookie, deleteCookie, getCookie };
}
