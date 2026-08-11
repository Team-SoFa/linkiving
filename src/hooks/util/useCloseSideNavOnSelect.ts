'use client';

import { useSideNavStore } from '@/stores/sideNavStore';
import { useCallback } from 'react';

import { useIsMobile } from './useIsMobile';

/**
 * 사이드 내비게이션에서 항목을 선택했을 때 호출한다.
 *
 * 모바일 드로어에서만 닫는다. 데스크톱에서 `isOpen` 은 "확장(240px)/축소(80px) 폭"을
 * 의미하고 LinkNavItem / NavItem 의 라벨 표시에도 쓰이므로, 가드 없이 닫으면
 * 클릭할 때마다 데스크톱 레일이 접힌다.
 */
export function useCloseSideNavOnSelect() {
  const setOpen = useSideNavStore(state => state.setOpen);
  const isMobile = useIsMobile();

  return useCallback(() => {
    if (isMobile) setOpen(false);
  }, [isMobile, setOpen]);
}

export default useCloseSideNavOnSelect;
