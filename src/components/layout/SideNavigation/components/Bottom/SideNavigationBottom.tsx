import Button from '@/components/basics/Button/Button';
import Divider from '@/components/basics/Divider/Divider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';
import Spinner from '@/components/basics/Spinner/Spinner';
import { useLogout } from '@/hooks/useLogout';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useCloseSideNavOnSelect } from '@/hooks/util/useCloseSideNavOnSelect';
import { useModalStore } from '@/stores/modalStore';

import NavItem from '../NavItem/NavItem';

const PROFILE_MENU_LINKS = [
  {
    label: '이용 약관',
    icon: 'IC_Document',
    href: 'https://linkiving.notion.site/3b1e28654151808499e4c3a8c06d727d?source=copy_link',
  },
  {
    label: '개인정보 처리방침',
    icon: 'IC_UserCheck',
    href: 'https://linkiving.notion.site/v1-0-3b1e2865415180dfab49ea4c733666e5?source=copy_link',
  },
  {
    label: '문의 및 오류 보고',
    icon: 'IC_Chat',
    href: 'https://forms.gle/1YmRQDVVtA2FkmQe6',
  },
] as const;

const SideNavigationBottom = () => {
  const { data: user, isLoading } = useUserInfo();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  const closeSideNav = useCloseSideNavOnSelect();
  const { open } = useModalStore();
  if (isLoading) {
    return (
      <div className="flex shrink-0 items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray50 mt-auto shrink-0">
      <Popover placement="top-end">
        <PopoverTrigger popoverKey="user">
          {user ? (
            <NavItem
              label={user.name ?? 'User'}
              icon="IC_Logo"
              profile={user.profileImageUrl}
              ariaLabel="사용자 메뉴 버튼"
            />
          ) : (
            <NavItem label="User" icon="IC_Logo" ariaLabel="사용자 메뉴 버튼" />
          )}
        </PopoverTrigger>
        <PopoverContent popoverKey="user">
          {close => (
            <div className="flex min-w-52 flex-col gap-2 p-3">
              {PROFILE_MENU_LINKS.map(({ label, icon, href }) => (
                <Button
                  key={href}
                  variant="tertiary_subtle"
                  contextStyle="onPanel"
                  label={label}
                  size="sm"
                  icon={icon}
                  radius="full"
                  className="w-full justify-start"
                  onClick={() => {
                    window.open(href, '_blank', 'noopener,noreferrer');
                    close();
                    closeSideNav();
                  }}
                />
              ))}
              <div className="py-1">
                <Divider color="gray200" />
              </div>
              <Button
                variant="tertiary_subtle"
                contextStyle="onPanel"
                label={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                size="sm"
                icon="IC_Logout"
                radius="full"
                className="w-full justify-start"
                // 로그아웃은 드로어를 닫지 않는다. useLogout 의 성공/실패 콜백이
                // 이 컴포넌트의 mutation observer 에 묶여 있어서, 여기서 언마운트하면
                // '/' 로 보내는 리다이렉트가 실행되지 않는다. (성공 시 '/' 로 이동하면서 자연히 사라진다)
                onClick={() => {
                  handleLogout();
                  close();
                }}
                disabled={isLoggingOut}
              />
              <Button
                variant="tertiary_subtle"
                contextStyle="onPanel"
                label="회원 탈퇴"
                disabled={isLoggingOut}
                size="sm"
                icon="IC_Delete"
                radius="full"
                className="w-full justify-start"
                onClick={() => {
                  close();
                  open('ACCOUNT_DELETE');
                  closeSideNav();
                }}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SideNavigationBottom;
