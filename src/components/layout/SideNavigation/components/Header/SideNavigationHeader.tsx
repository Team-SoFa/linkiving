import IconButton from '@/components/basics/IconButton/IconButton';
import { MouseEvent } from 'react';

interface Props {
  isOpen: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const SideNavigationHeader = ({ isOpen, onClick }: Props) => {
  return (
    <div className="mb-10">
      <IconButton
        icon="IC_SidenavOpen"
        variant="tertiary_subtle"
        size="lg"
        ariaLabel={isOpen ? '좌측 사이드바 메뉴 닫기' : '좌측 사이드바 메뉴 열기'}
        onClick={onClick}
      />
    </div>
  );
};

export default SideNavigationHeader;
