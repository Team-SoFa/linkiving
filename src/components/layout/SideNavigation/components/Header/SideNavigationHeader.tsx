import { MouseEvent } from 'react';

import SideNavToggle from './SideNavToggle';

interface Props {
  isOpen: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const SideNavigationHeader = ({ isOpen, onClick }: Props) => {
  return (
    <div className="mb-10">
      <SideNavToggle isOpen={isOpen} onClick={onClick} />
    </div>
  );
};

export default SideNavigationHeader;
