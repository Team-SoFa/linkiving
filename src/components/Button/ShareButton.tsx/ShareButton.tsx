'use client';

import Button, { ButtonProps } from '../Button';

export default function ShareButton(props: ButtonProps) {
  const { label = '공유하기', onClick, variant, size, icon = '🔗', iconPosition, disabled } = props;

  const handleShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    // SSR 환경 에러 방지
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      console.warn('window or navigator undefined');
      return;
    }
    if (onClick) {
      onClick(event);
      if (event.defaultPrevented) return;
    }
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch((error: unknown) => {
          const name = (error as DOMException)?.name;
          // 공유 취소
          if (name === 'AbortError' || name === 'NotAllowedError') return; // 사용자가 취소/거부
          // 공유 실패
          console.error('공유 실패:', error);
        });
    } else {
      console.warn('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <Button
      label={label}
      onClick={handleShare}
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
    />
  );
}
