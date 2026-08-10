'use client';

import { useEffect, useState } from 'react';

/**
 * 소프트 키보드가 화면 하단을 가린 높이(px)를 반환한다.
 *
 * Android Chrome은 viewport meta의 `interactive-widget=resizes-content` 덕분에
 * 레이아웃 뷰포트(window.innerHeight)가 함께 줄어들어 0을 반환한다. 이 경우
 * CSS의 dvh만으로 이미 처리되므로 추가 보정이 필요 없다.
 *
 * iOS Safari는 `interactive-widget`을 지원하지 않고 비주얼 뷰포트만 축소하므로
 * innerHeight가 그대로 남아 실제 키보드 높이가 계산된다.
 * 즉 플랫폼 분기 없이 필요한 곳에서만 값이 나온다.
 */
export default function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      // offsetTop을 더해야 iOS가 페이지 자체를 밀어 올린 경우까지 보정된다.
      const next = Math.max(0, window.innerHeight - (viewport.height + viewport.offsetTop));
      setInset(prev => (Math.abs(prev - next) < 1 ? prev : next));
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
