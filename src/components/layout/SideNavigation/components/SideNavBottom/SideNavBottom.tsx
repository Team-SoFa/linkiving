import Button from '@/components/basics/Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';

import NavItem from '../NavItem/NavItem';

const SideNavigationBottom = () => {
  return (
    // TODO: 하드코딩 된 User Name을 로그인 연동 이후 수정
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
                alert('로그아웃 되었습니다.'); // TODO: 실제 로그아웃 로직으로 대체
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
