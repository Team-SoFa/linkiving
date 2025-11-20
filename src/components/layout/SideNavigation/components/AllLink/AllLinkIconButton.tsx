import LinkIconButton from '@/components/wrappers/LinkIconButton/LinkIconButton';

const AllLinkLinkIconButton = () => {
  return (
    <LinkIconButton
      href="/all-link"
      icon="IC_AllLink"
      size="lg"
      variant="teritary_subtle"
      contextStyle="onPanel"
      ariaLabel="전체 링크 페이지 이동 버튼"
    />
  );
};

AllLinkLinkIconButton.displayName = 'AllLinkLinkIconButton';
export default AllLinkLinkIconButton;
