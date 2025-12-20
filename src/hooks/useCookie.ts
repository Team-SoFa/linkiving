'use client';

import { useCallback, useEffect, useState } from 'react';

interface CookieOptions {
  maxAge?: number; // 초 단위
  days?: number; // 일 단위
  secure?: boolean;
  path?: string;
}

export function useCookie(key: string) {
  const getCookie = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));

    if (!cookie) return null;
    const value = cookie.substring(key.length + 1);

    return value ? decodeURIComponent(value) : null;
  }, [key]);

  const [cookie, setCookieState] = useState<string | null>(null);

  useEffect(() => {
    setCookieState(getCookie());
  }, [getCookie]);

  const setCookie = useCallback(
    (value: string, options: CookieOptions = {}) => {
      const {
        maxAge,
        days = 7,
        secure = process.env.NODE_ENV === 'production',
        path = '/',
      } = options;

      let cookieString = `${key}=${encodeURIComponent(value)}`;

      // maxAge 또는 days 중 하나만 사용
      if (maxAge !== undefined) {
        cookieString += `;max-age=${maxAge}`;
      } else {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        cookieString += `;expires=${expires.toUTCString()}`;
      }

      cookieString += `;path=${path}`;
      cookieString += ';SameSite=Lax';
      if (secure) cookieString += ';Secure';

      document.cookie = cookieString;
      setCookieState(value);
    },
    [key]
  );

  const deleteCookie = useCallback(
    (path: string = '/') => {
      const shouldBeSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const secureFlag = shouldBeSecure ? ';Secure' : '';
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};SameSite=Lax${secureFlag}`;
      setCookieState(null);
    },
    [key]
  );

  return { cookie, setCookie, deleteCookie, getCookie };
}

// 여러 쿠키를 한 번에 관리하는 유틸리티 함수
export const setCookieUtil = (key: string, value: string, options: CookieOptions = {}) => {
  if (typeof window === 'undefined') return;
  const { maxAge, days = 7, secure = process.env.NODE_ENV === 'production', path = '/' } = options;

  let cookieString = `${key}=${encodeURIComponent(value)}`;

  if (maxAge !== undefined) {
    cookieString += `;max-age=${maxAge}`;
  } else {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `;expires=${expires.toUTCString()}`;
  }

  cookieString += `;path=${path}`;
  cookieString += ';SameSite=Lax';
  if (secure) cookieString += ';Secure';

  document.cookie = cookieString;
};
