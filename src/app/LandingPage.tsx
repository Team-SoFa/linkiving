'use client';

import ICLandingBackground from '@/components/Icons/svgs/ic_landing_background.svg';
import ICLandingIcLogo from '@/components/Icons/svgs/ic_landing_ic_logo.svg';
import ICLandingTextLogo from '@/components/Icons/svgs/ic_landing_text_logo.svg';
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
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    if (!token) {
      console.error('NEXT_PUBLIC_API_TOKEN is missing');
      return;
    }

    // 백엔드 인증 토큰 저장
    setCookieUtil(COOKIES_KEYS.ACCESS_TOKEN, token, {
      maxAge: 60 * 60 * 24, // 1일
      path: '/',
    });

    // 개발용 유저 정보 (UI용)
    setCookieUtil(
      COOKIES_KEYS.USER_INFO,
      JSON.stringify({
        id: 'dev',
        email: 'dev@test.com',
        name: '개발자',
        picture: '',
      }),
      {
        maxAge: 60 * 60 * 24,
        path: '/',
      }
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
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="flex items-center gap-5">
          <div className="h-[53px] w-[60px] [&>svg]:h-full [&>svg]:w-full" aria-hidden="true">
            <ICLandingIcLogo />
          </div>
          <div className="h-[50px] w-[240px] [&>svg]:h-full [&>svg]:w-full" aria-label="Linkiving">
            <ICLandingTextLogo />
          </div>
        </div>
        <h2 className="font-label-xl mt-4 text-gray-800">로그인</h2>
        <p className="font-body-md mt-1 text-gray-600">
          서비스 이용을 위해 구글 계정으로 로그인해 주세요.
        </p>
        <div className="my-8 h-px w-48 bg-gray-200" />

        {error && (
          <div className="bg-red100 text-red700 mb-6 w-full rounded-lg p-4 text-sm">
            {error === 'auth_failed' && '로그인에 실패했습니다.'}
            {error === 'server_error' && '서버 오류가 발생했습니다.'}
            {!['auth_failed', 'server_error'].includes(error) && '오류가 발생했습니다.'}
            <br />
            잠시 후 다시 시도해주세요.
          </div>
        )}

        {/* 개발 모드 전용 버튼 */}
        {isDev && (
          <button
            onClick={devLogin}
            className="bg-gray800 mb-3 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            🔧 개발 모드 로그인
          </button>
        )}
        <button
          onClick={() => router.push('/signup')}
          className="mb-3 flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-4 font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
        >
          회원가입 하기
        </button>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
        >
          <Image src="/images/google-icon.png" alt="구글 로고" width={20} height={20} />
          Google 계정으로 계속하기
        </button>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-[320px] overflow-hidden [&>svg]:h-full [&>svg]:w-full">
        <ICLandingBackground aria-hidden="true" />
      </div>
    </div>
  );
}
