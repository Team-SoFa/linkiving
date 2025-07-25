import LinkButton from '@/components/wrappers/LinkButton/LinkButton';

const NewChatLinkButton = () => {
  return (
    <LinkButton
      href="/home"
      icon="IC_Chat"
      size="lg"
      label="새 채팅"
      variant="teritary_subtle"
      contextStyle="onPanel"
      className="flex h-10 w-50 justify-start pl-2"
      radius="full"
    />
  );
};

NewChatLinkButton.displayName = 'NewChatLinkButton';
export default NewChatLinkButton;
