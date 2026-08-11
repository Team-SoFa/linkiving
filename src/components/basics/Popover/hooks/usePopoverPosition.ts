'use client';

import { Placement, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { useEffect } from 'react';

export const usePopoverPosition = (
  triggerRef: HTMLElement | null, // 기준이 되는 엘리먼트 (trigger)
  placement: Placement = 'bottom-start' // 기본 위치
) => {
  const { refs, floatingStyles } = useFloating({
    placement,
    // 기준 요소로부터의 거리, 화면 공간에 맞춰 뒤집기, 화면 안으로 밀어넣기(가장자리 8px 여백)
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    // 스크롤 가능한 조상/리사이즈를 구독해 위치를 계속 갱신한다.
    // 사이드 내비게이션처럼 스크롤되는 컨테이너 안의 트리거에서 필수.
    whileElementsMounted: autoUpdate,
  });

  // trigger를 Floating UI에 연결
  useEffect(() => {
    refs.setReference(triggerRef);
  }, [triggerRef, refs]);

  return { refs, floatingStyles };
};
