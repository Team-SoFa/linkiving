import LinkNavItem from './NavItem/LinkNavItem';

const MypageButton = () => {
  return (
    <LinkNavItem
      icon="IC_Account"
      label="마이 페이지"
      href="/mypage"
      ariaLabel="마이 페이지 이동 버튼"
    />
  );
};

export default MypageButton;
