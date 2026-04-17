'use client';

import ICLandingIcLogo from '@/components/Icons/svgs/ic_landing_ic_logo.svg';
import ICLandingTextLogo from '@/components/Icons/svgs/ic_landing_text_logo.svg';
import Image from 'next/image';

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: '로그인에 실패했습니다.',
  server_error: '서버 오류가 발생했습니다.',
  unauthorized: '로그인이 필요합니다.',
  session_expired: '세션이 만료되었습니다. 다시 로그인해주세요.',
};

type Props = {
  error?: string;
};

export default function Landing({ error }: Props) {
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_API_URL is not configured');
      return;
    }

    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50">
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-screen overflow-hidden">
        <Image
          src="/images/sofa_login_bg_resource.png"
          alt="배경 이미지"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="flex items-center gap-5">
          <div className="h-[53px] w-[60px] [&>svg]:h-full [&>svg]:w-full">
            <ICLandingIcLogo />
          </div>
          <div className="h-[50px] w-60 [&>svg]:h-full [&>svg]:w-full">
            <ICLandingTextLogo />
          </div>
        </div>

        <h2 className="mt-4 text-gray-800">로그인</h2>

        <p className="mt-1 text-gray-600">서비스 이용을 위해 구글 계정으로 로그인해 주세요.</p>

        <div className="my-8 h-px w-48 bg-gray-200" />

        {error && (
          <div className="bg-red100 text-red700 mb-6 w-full rounded-lg p-4 text-sm">
            {ERROR_MESSAGES[error] ?? '오류가 발생했습니다.'}
            <br />
            잠시 후 다시 시도해주세요.
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
        >
          <Image src="/images/google-icon.png" alt="구글 로고" width={20} height={20} />
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
  );
}
