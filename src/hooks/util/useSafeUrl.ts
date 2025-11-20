// 안전한 url인지 검사후, 검사된 safeHref를 반환

'use client';

export function useSafeUrl(link: string) {
  const safeHref = /^https?:\/\//i.test(link) ? link : '';

  return safeHref;
}
