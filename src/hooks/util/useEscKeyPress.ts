import { useEffect } from 'react';

interface Props {
  onEscPress: () => void; // ESC 키 눌렸을 때 실행할 함수
  enabled?: boolean;
}

export default function useEscKeyPress({ onEscPress, enabled = true }: Props) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscPress();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscPress, enabled]);
}
