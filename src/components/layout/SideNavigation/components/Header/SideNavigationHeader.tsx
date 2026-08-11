import IconButton from '@/components/basics/IconButton/IconButton';
import clsx from 'clsx';
import { MouseEvent, forwardRef } from 'react';

interface Props {
  isOpen: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  /** 기본은 패널 안에 놓이는 ghost 트리거. 페이지 콘텐츠 위에 뜨는 모바일 트리거는 배경이 있는 variant 를 쓴다. */
  variant?: 'tertiary_subtle' | 'tertiary_neutral';
  /** 페이지 콘텐츠 위에 떠 있는 모바일 플로팅 트리거 여부 */
  floating?: boolean;
}

const SideNavigationHeader = forwardRef<HTMLButtonElement, Props>(function SideNavigationHeader(
  { isOpen, onClick, variant = 'tertiary_subtle', floating = false },
  ref
) {
  return (
    <div className={clsx(!floating && 'mb-10')}>
      <IconButton
        ref={ref}
        icon="IC_SidenavOpen"
        variant={variant}
        size="lg"
        ariaLabel={isOpen ? '좌측 사이드바 메뉴 닫기' : '좌측 사이드바 메뉴 열기'}
        aria-expanded={isOpen}
        onClick={onClick}
        className={clsx(
          // 시각 크기 40px 은 유지하고 히트 영역만 48px 로 확장 (WCAG 2.5.5 / Apple 44pt)
          'relative after:absolute after:-inset-1 after:content-[""]',
          floating && 'shadow-sm'
        )}
      />
    </div>
  );
});

export default SideNavigationHeader;
