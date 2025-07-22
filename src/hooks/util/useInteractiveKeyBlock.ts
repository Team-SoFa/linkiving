// 클릭 가능한 영역에서 내의 인터랙티브 요소는 건드리지 않으며 Enter/Space 키로 카드 활성화를 하도록 하는 키보드 이벤트 관리 훅
// ex. 카드 컴포넌트 내 버튼/링크 클릭을 막으며, 키로 카드 클릭을 가능하게 함
import { useCallback } from 'react';

interface UseInteractiveKeyBlockParams {
  onClick?: () => void;
}

export function useInteractiveKeyBlock({ onClick }: UseInteractiveKeyBlockParams) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (!onClick) return;

      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest(
        'a,button,[role="button"],input,textarea,select,[contenteditable="true"],[tabindex]:not([tabindex="-1"]'
      );

      if (isInteractive) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );
}
