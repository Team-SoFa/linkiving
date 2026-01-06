import Button from '@/components/basics/Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';

import NavItem from '../NavItem/NavItem';

const SideNavigationBottom = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="bg-gray50 mt-auto shrink-0">
      <Popover placement="top-end">
        <PopoverTrigger popoverKey="user">
          <NavItem label="User Name" icon="IC_Logo" ariaLabel="사용자 메뉴 버튼" />
        </PopoverTrigger>
        <PopoverContent popoverKey="user">
          <Button
            variant="tertiary_subtle"
            contextStyle="onPanel"
            label="로그아웃"
            size="sm"
            icon="IC_Logout"
            radius="full"
            className="m-3 pr-13"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SideNavigationBottom;
