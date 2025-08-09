import Button, { ButtonProps } from '../Button';

export default function ShareButton(props: ButtonProps) {
  const { label = '공유하기', onClick, variant, size, icon = '🔗', iconPosition, disabled } = props;

  const handleShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    } else {
      if (navigator.share) {
        navigator
          .share({
            title: document.title,
            url: window.location.href,
          })
          .catch(error => {
            // 공유 취소
            if (error.name === 'AbortError' || error.message?.includes('cancel')) return;
            // 공유 실패
            console.error('공유 실패:', error);
          });
      } else {
        alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
      }
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
