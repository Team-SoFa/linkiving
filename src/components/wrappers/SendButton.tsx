import IconButton from '@/components/basics/IconButton/IconButton';

interface SendButtonProps {
  disabled: boolean;
  onClick: () => void;
}
const SendButton = ({ disabled, onClick }: SendButtonProps) => {
  return (
    <IconButton
      icon="IC_SendFilled"
      ariaLabel="메시지 전송 버튼"
      disabled={disabled}
      onClick={onClick}
      size="sm"
      variant="tertiary_subtle"
      contextStyle="onMain"
      className="absolute right-0 bottom-0 mr-3 mb-2"
    />
  );
};

SendButton.displayName = 'SendButton';
export default SendButton;
