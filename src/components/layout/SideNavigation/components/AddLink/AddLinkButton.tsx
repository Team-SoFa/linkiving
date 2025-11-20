import NavItem from '../NavItem/NavItem';

interface AddLinkButtonProps {
  onClick: () => void;
}

const AddLinkButton = ({ onClick }: AddLinkButtonProps) => {
  return <NavItem icon="IC_LinkAdd" label="링크 추가" onClick={onClick} />;
};

AddLinkButton.displayName = 'AddLinkButton';
export default AddLinkButton;
