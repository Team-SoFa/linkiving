import Button from '@/components/basics/Button/Button';
// import Toast from '@/components/basics/Toast/Toast';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';

interface Props {
  disabled: boolean;
  type: 'prev' | 'new';
  onClick: () => void;
}

export default function PostReSummaryButton({ type, disabled, onClick }: Props) {
  const { close } = useModalStore();
  // const [toastVisible, setToastVisible] = useState(false);

  const handleClick = () => {
    onClick();
    if (type === 'prev') {
      close();
      showToast({
        id: 'save-prev',
        message: '기존 요약을 유지했습니다.',
        variant: 'success',
      });
    } else if (type === 'new') {
      close();
      showToast({
        id: 'save-new',
        message: '새로운 요약을 저장했습니다.',
        variant: 'success',
      });
    }
  };

  return (
    <>
      <Button
        variant={type === 'prev' ? 'secondary' : 'primary'}
        label={type === 'prev' ? '기존 요약 유지하기' : '재생성된 요약 덮어쓰기'}
        disabled={disabled}
        className="w-full"
        onClick={handleClick}
      />
    </>
  );
}
