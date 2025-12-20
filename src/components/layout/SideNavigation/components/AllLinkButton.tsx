import LinkNavItem from './NavItem/LinkNavItem';

const AllLinkButton = () => {
  return (
    <LinkNavItem icon="IC_AllLink" label="전체 링크" href="/all-link" ariaLabel="전체 링크 버튼" />
  );
};

AllLinkButton.displayName = 'AllLinkLinkButton';
export default AllLinkButton;
