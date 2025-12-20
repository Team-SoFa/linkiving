'use client';

import { setCookieUtil } from '@/hooks/useCookie';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Landing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const isDev = process.env.NODE_ENV === 'development';

  // 개발용 가짜 로그인 TODO: 나중에 지우기(사실 랜딩을 다 갈아야하긴 하지만)
  const devLogin = () => {
    setCookieUtil(COOKIES_KEYS.ACCESS_TOKEN, 'dev_token', { maxAge: 86400 });
    setCookieUtil(
      COOKIES_KEYS.USER_INFO,
      JSON.stringify({ id: 'dev', email: 'dev@test.com', name: '개발자', picture: '' }),
      { maxAge: 86400 }
    );
    router.push('/home');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_API_URL}/oauth2/authorization/google`; // 백엔드 URL로 변경
  };

  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
    }
  }, [error]);

  return (
    <div className="from-blue500 flex min-h-screen items-center justify-center bg-linear-to-br to-purple-600">
      <div className="w-full max-w-md rounded-2xl bg-white p-12 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Welcome</h1>
          <p className="text-gray600">로그인하여 서비스를 이용하세요</p>
        </div>

        {error && (
          <div className="bg-red100 text-red700 mb-6 rounded-lg p-4 text-sm">
            {error === 'auth_failed' && '로그인에 실패했습니다.'}
            {error === 'server_error' && '서버 오류가 발생했습니다.'}
            {!['auth_failed', 'server_error'].includes(error) && '오류가 발생했습니다.'}
            <br />
            다시 시도해주세요.
          </div>
        )}

        {/* 개발 모드 전용 버튼 */}
        {isDev && (
          <button
            onClick={devLogin}
            className="bg-gray800 mb-3 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full px-6 py-4 font-medium text-white transition hover:bg-gray-700"
          >
            🔧 개발 모드 로그인
          </button>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-4 font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
        >
          <Image src="/images/google-icon.png" alt="구글 로고" width={20} height={20} />
          Google로 시작하기
        </button>

        <p className="text-gray500 mt-6 text-center text-xs">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
