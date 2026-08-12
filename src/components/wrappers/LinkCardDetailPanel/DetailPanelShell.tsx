'use client';

import Divider from '@/components/basics/Divider/Divider';
import IconButton from '@/components/basics/IconButton/IconButton';
import { FOCUSABLE_SELECTORS } from '@/components/basics/Modal/Modal';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { styles } from './LinkCardDetailPanel.style';

/**
 * 패널이 화면 전체를 덮는 구간 (md 미만).
 * 이 구간에서만 모달로 동작한다 — md~xl은 우측 레일, xl 이상은 in-flow aside라
 * 페이지가 그대로 조작 가능하므로 dialog 시맨틱과 포커스 트랩을 걸면 안 된다.
 */
const FULLSCREEN_QUERY = '(max-width: 767px)';

function useIsFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(FULLSCREEN_QUERY);
    setIsFullscreen(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsFullscreen(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isFullscreen;
}

interface DetailPanelShellProps {
  children: React.ReactNode;
  /**
   * 넘기면 닫기 버튼만 있는 최소 헤더를 렌더한다.
   * 로딩·에러·빈 상태처럼 아직 URL이 없어 HeaderSection을 못 쓰는 경우용 —
   * 데이터를 기다리는 동안에도 사용자가 패널을 닫을 수 있어야 한다.
   */
  onClose?: () => void;
  /** 본문을 남은 영역 중앙에 배치한다 (로딩·에러·빈 상태). */
  centered?: boolean;
}

/**
 * 상세 패널의 root 지오메트리를 단독으로 소유한다.
 * 로딩·에러·본문 상태가 모두 이 셸을 거치므로 반응형 분기가 서로 어긋날 수 없다.
 */
export default function DetailPanelShell({
  children,
  onClose,
  centered = false,
}: DetailPanelShellProps) {
  const { root, content } = styles();
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isFullscreen = useIsFullscreen();

  /*
   * 전체화면일 때만 모달처럼 동작한다: 열릴 때 포커스를 패널로 옮기고,
   * Tab을 패널 안에 가두고, 닫힐 때 원래 요소로 되돌린다.
   * 트랩/복원 방식은 Modal.tsx의 기존 구현을 그대로 따른다.
   */
  useEffect(() => {
    if (!isFullscreen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const frame = requestAnimationFrame(() => panelRef.current?.focus());

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
      if (focusable.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // 패널 밖(아래 깔린 링크 리스트 등)에 포커스가 있으면 안으로 되돌린다
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isFullscreen]);

  return (
    <aside
      ref={panelRef}
      className={clsx(root(), onClose && 'flex flex-col')}
      role={isFullscreen ? 'dialog' : undefined}
      aria-modal={isFullscreen || undefined}
      aria-label={isFullscreen ? '링크 상세 정보' : undefined}
      tabIndex={isFullscreen ? -1 : undefined}
    >
      {onClose && (
        <div className="shrink-0">
          {/* header 슬롯은 justify-between이라 재사용하면 클래스가 충돌한다 — 명시적으로 작성 */}
          <header className="flex items-center justify-end px-5 py-3">
            <IconButton
              icon="IC_Close"
              size="sm"
              variant="tertiary_subtle"
              contextStyle="onPanel"
              ariaLabel="상세패널 닫기"
              onClick={onClose}
            />
          </header>
          <Divider />
        </div>
      )}

      <div
        className={
          centered
            ? 'text-gray600 flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-5 pb-6'
            : content()
        }
      >
        {children}
      </div>
    </aside>
  );
}
