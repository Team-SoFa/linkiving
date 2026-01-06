import Button from '@/components/basics/Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';

import NavItem from '../NavItem/NavItem';

const SideNavigationBottom = () => {
  return (
    <div className="bg-gray50 mt-auto shrink-0">
      <Popover placement="top-end">
        <PopoverTrigger popoverKey="user">
          <NavItem label="User Name" icon="IC_Logo" ariaLabel="사용자 메뉴 버튼" />
        </PopoverTrigger>
        <PopoverContent popoverKey="user">
          {close => (
            <Button
              variant="tertiary_subtle"
              contextStyle="onPanel"
              label="로그아웃"
              size="sm"
              icon="IC_Logout"
              radius="full"
              className="m-3 pr-13"
              onClick={() => {
                console.log('로그아웃'); // TODO: 백 로그아웃 기능 구현 이후 엔드포인트 연결
                close();
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SideNavigationBottom;
