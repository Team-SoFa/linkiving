'use client';

import { logout } from '@/apis/authApi';
import Button from '@/components/basics/Button/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Mypage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error: ', err);
      alert('로그아웃 중 에러가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // if (!user) return null;

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <span>마이페이지</span>
      <Button
        label={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        onClick={async e => {
          await handleLogout();
          (e.currentTarget as HTMLButtonElement | null)?.blur();
        }}
        disabled={isLoggingOut}
      />
    </div>
  );
}
