import IconButton from '@/components/basics/IconButton/IconButton';

interface SideNavToggleProps {
  isOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SideNavToggle = ({ isOpen, onClick }: SideNavToggleProps) => {
  return (
    <IconButton
      icon="IC_SidenavOpen"
      variant="teritary_subtle"
      contextStyle="onPanel"
      size="lg"
      ariaLabel={isOpen ? '좌측 사이드바 메뉴 닫기' : '좌측 사이드바 메뉴 열기'}
      onClick={onClick}
    />
  );
};

SideNavToggle.displayName = 'SideNavToggle';
export default SideNavToggle;
