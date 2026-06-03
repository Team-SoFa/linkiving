'use client';

import { redirectToGoogleOAuth } from '@/lib/oauth';
import Image from 'next/image';

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    redirectToGoogleOAuth();
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white py-[14.5px] text-black hover:bg-gray-100"
    >
      <Image
        src="/images/google-icon.png"
        alt=""
        width={20}
        height={20}
        className="mr-2 inline-block"
      />
      <span className="text-[18px] font-semibold">구글 계정으로 시작하기</span>
    </button>
  );
}
