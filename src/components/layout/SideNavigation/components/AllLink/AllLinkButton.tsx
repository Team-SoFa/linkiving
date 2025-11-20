import LinkButton from '@/components/wrappers/LinkButton/LinkButton';

const AllLinkLinkButton = () => {
  return (
    <LinkButton
      href="/all-link"
      icon="IC_AllLink"
      size="lg"
      label="전체 링크"
      variant="teritary_subtle"
      contextStyle="onPanel"
      className="flex h-10 w-50 justify-start pl-2"
      radius="full"
    />
  );
};

AllLinkLinkButton.displayName = 'AllLinkLinkButton';
export default AllLinkLinkButton;
