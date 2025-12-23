import Button from '@/components/basics/Button/Button';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';

interface Props {
  disabled: boolean;
  type: 'prev' | 'new';
  onClick?: () => void;
}

export default function PostReSummaryButton({ type, disabled, onClick }: Props) {
  const { close } = useModalStore();

  const handleClick = async () => {
    await onClick?.();
    close();
    showToast({
      id: type === 'prev' ? 'save-prev' : 'save-new',
      message: type === 'prev' ? '기존 요약을 유지했습니다.' : '새로운 요약을 저장했습니다.',
      variant: 'success',
    });
  };

  return (
    <Button
      variant={type === 'prev' ? 'secondary' : 'primary'}
      label={type === 'prev' ? '기존 요약 유지하기' : '재생성된 요약 덮어쓰기'}
      disabled={disabled}
      className="w-full"
      onClick={handleClick}
    />
  );
}
