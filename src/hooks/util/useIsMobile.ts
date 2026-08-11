'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Tailwind `md` 브레이크포인트 미만을 모바일로 본다. */
export const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

/**
 * matchMedia 를 useSyncExternalStore 로 구독한다.
 *
 * useEffect/useLayoutEffect 기반 구현과 달리
 * - 서버 렌더링 시 useLayoutEffect 경고가 없고
 * - 첫 클라이언트 렌더에서 곧바로 올바른 값을 반환한다 (한 커밋 늦지 않는다).
 *
 * 서버 스냅샷은 데스크톱(false) 기준이다.
 */
export function useIsMobile(query: string = MOBILE_MEDIA_QUERY) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export default useIsMobile;
