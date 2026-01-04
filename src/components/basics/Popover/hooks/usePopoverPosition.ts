'use client';

import { Placement, flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { useEffect } from 'react';

export const usePopoverPosition = (
  triggerRef: HTMLElement | null, // 기준이 되는 엘리먼트 (trigger)
  isOpen: boolean, // Popover가 열려있을 때만 위치를 계산
  placement: Placement = 'bottom-start' // 기본 위치
) => {
  const { refs, floatingStyles, update } = useFloating({
    placement,
    middleware: [offset(6), flip(), shift()], // 기준 요소로부터의 거리, 화면 공간에 맞춰 뒤집기, 화면 안으로 밀어넣기
  });

  // trigger를 Floating UI에 연결
  useEffect(() => {
    refs.setReference(triggerRef);
  }, [triggerRef, refs]);

  // Popover가 열릴 때마다 위치 업데이트
  useEffect(() => {
    if (isOpen) update();
  }, [isOpen, update]);

  return { refs, floatingStyles };
};
