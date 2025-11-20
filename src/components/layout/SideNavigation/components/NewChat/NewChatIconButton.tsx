import LinkIconButton from '@/components/wrappers/LinkIconButton/LinkIconButton';

const NewChatLinkIconButton = () => {
  return (
    <LinkIconButton
      href="/home"
      icon="IC_Chat"
      size="lg"
      variant="teritary_subtle"
      contextStyle="onPanel"
      ariaLabel="새 채팅 생성"
    />
  );
};

NewChatLinkIconButton.displayName = 'NewChatLinkIconButton';
export default NewChatLinkIconButton;
