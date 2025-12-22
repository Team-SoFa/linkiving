'use client';

import { useCallback, useState } from 'react';

export function useCookie(key: string) {
  const getCookie = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));

    if (!cookie) return null;
    const value = cookie.substring(key.length + 1);

    return value ? decodeURIComponent(value) : null;
  }, [key]);

  const [cookie, setCookieState] = useState<string | null>(getCookie);

  const setCookie = useCallback(
    (value: string, days: number = 7, secure: boolean = process.env.NODE_ENV === 'production') => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

      const secureFlag = secure ? ';Secure' : '';
      document.cookie = `${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax${secureFlag}`;
      setCookieState(value);
    },
    [key]
  );

  const deleteCookie = useCallback(() => {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    setCookieState(null);
  }, [key]);

  return { cookie, setCookie, deleteCookie, getCookie };
}
