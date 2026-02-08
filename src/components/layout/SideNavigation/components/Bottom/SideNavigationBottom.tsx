import Button from '@/components/basics/Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';
import { useLogout } from '@/hooks/useLogout';
import { useUserInfo } from '@/hooks/useUserInfo';

import NavItem from '../NavItem/NavItem';

const SideNavigationBottom = () => {
  const { data: user, isLoading } = useUserInfo();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  if (isLoading) {
    return <div className="bg-gray50 mt-auto shrink-0 p-5">로딩 중...</div>;
  }

  if (!user) {
    return <div className="bg-gray50 mt-auto shrink-0" />;
  }

  return (
    <div className="bg-gray50 mt-auto shrink-0">
      <Popover placement="top-end">
        <PopoverTrigger popoverKey="user">
          <NavItem label={user.name ?? 'User'} icon="IC_Logo" ariaLabel="사용자 메뉴 버튼" />
        </PopoverTrigger>
        <PopoverContent popoverKey="user">
          {close => (
            <Button
              variant="tertiary_subtle"
              contextStyle="onPanel"
              label={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              size="sm"
              icon="IC_Logout"
              radius="full"
              className="m-3 pr-13"
              onClick={() => {
                handleLogout();
                close();
              }}
              disabled={isLoggingOut}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SideNavigationBottom;
