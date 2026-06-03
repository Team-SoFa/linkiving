'use client';

import Image from 'next/image';

export default function LandingFooter() {
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) return;
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <footer className="bg-gray900 m-10 rounded-[20px] p-15">
      <div className="flex flex-col items-center gap-10 pb-20 text-center">
        <h2 className="font-display text-white">
          나만의 AI 북마크 저장소
          <br />
          지금 바로 시작해보세요.
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="border-gray200 flex cursor-pointer items-center gap-3 rounded-full border bg-white px-10 py-4"
        >
          <Image src="/images/google-icon.png" alt="Google" width={24} height={24} />
          <span className="text-gray900 text-[16px] font-semibold">Google 계정으로 시작하기</span>
        </button>
      </div>
      <div className="flex justify-between">
        <span className="font-body-md text-gray100">© 2026 Linkiving all rights reserved</span>
        <span className="font-body-md text-gray100">E-MAIL | linkivingsofa@gmail.com</span>
      </div>
    </footer>
  );
}
