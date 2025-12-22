'use client';

import Button from '@/components/basics/Button/Button';
import { useAuth } from '@/hooks/server/useAuth';

export default function Mypage() {
  const { logout, isLoggingOut } = useAuth();

  // if (!user) return null;

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <span>마이페이지</span>
      <Button
        label={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        onClick={async e => {
          logout();
          (e.currentTarget as HTMLButtonElement | null)?.blur();
        }}
        disabled={isLoggingOut}
      />
    </div>
  );
}
