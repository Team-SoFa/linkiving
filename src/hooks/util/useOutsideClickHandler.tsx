import { useEffect, useRef } from 'react';

type OutsideClickHandler = (event: MouseEvent) => void;

export function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement | null>>,
  handler: OutsideClickHandler,
  enabled: boolean = true
) {
  const handlerRef = useRef(handler);

  // handler 최신화
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInside = refs.some(ref => ref.current && ref.current.contains(target));

      if (!isInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('click', listener, true);
    return () => {
      document.removeEventListener('click', listener, true);
    };
    // useRef로 handler의 최신 값을유지하므로 해당 useEffect에 의존성으로 넣을 필요 없음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
