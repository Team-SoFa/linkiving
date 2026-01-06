import LinkNavItem from '../NavItem/LinkNavItem';

const NewChatButton = () => {
  return <LinkNavItem icon="IC_Chat" label="새 채팅" href="/home" ariaLabel="새 채팅 버튼" />;
};

NewChatButton.displayName = 'NewChatButton';
export default NewChatButton;
