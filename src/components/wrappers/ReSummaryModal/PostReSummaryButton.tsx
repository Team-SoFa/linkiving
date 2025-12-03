import Button from '@/components/basics/Button/Button';
// import Toast from '@/components/basics/Toast/Toast';
import { useModalStore } from '@/stores/modalStore';

interface Props {
  type: 'prev' | 'new';
  isWriting?: boolean;
  // content: string;
}

export default function PostReSummaryButton({ type, isWriting }: Props) {
  const { close } = useModalStore();
  // const [toastVisible, setToastVisible] = useState(false);

  const onClick = () => {
    close();
    // setToastVisible(true);
  };

  // const handleToastClose = () => {
  //   setToastVisible(false);
  // };

  return (
    <>
      <Button
        variant={type === 'prev' ? 'secondary' : 'primary'}
        label={type === 'prev' ? '기존 요약 유지하기' : '새 요약 적용하기'}
        disabled={isWriting}
        className="w-full"
        onClick={onClick}
      />

      {/* {toastVisible && (
        <Toast
          id="summary-toast"
          message="요약을 적용했습니다."
          variant="success"
          duration={2000}
          onClose={handleToastClose}
        />
      )} */}
    </>
  );
}
