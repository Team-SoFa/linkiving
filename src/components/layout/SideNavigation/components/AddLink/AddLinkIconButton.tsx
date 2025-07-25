import IconButton from '@/components/basics/IconButton/IconButton';

interface AddLinkIconButtonProps {
  onClick: () => void;
}

const AddLinkIconButton = ({ onClick }: AddLinkIconButtonProps) => {
  return (
    <IconButton
      icon="IC_LinkAdd"
      size="lg"
      variant="teritary_subtle"
      contextStyle="onPanel"
      ariaLabel="링크 추가"
      onClick={onClick}
    />
  );
};

AddLinkIconButton.displayName = 'AddLinkIconButton';
export default AddLinkIconButton;
