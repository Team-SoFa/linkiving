'use client';

import { redirectToGoogleOAuth } from '@/lib/oauth';
import Image from 'next/image';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/dbbkgbbhhhhfpclfdkmomidnkgffpbod?utm_source=item-share-cb';

export default function LandingHeader() {
  const handleAddToChrome = () => {
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleStart = () => {
    redirectToGoogleOAuth();
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
        <Image
          src="/images/brand/full-logo-beta.svg"
          alt="Linkiving BETA"
          width={189}
          height={25}
          className="h-auto w-[clamp(132px,40vw,189px)] shrink-0"
          unoptimized
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToChrome}
            className="font-label-md hidden cursor-pointer rounded-lg bg-black px-4 py-2.5 whitespace-nowrap text-white hover:bg-gray-800 sm:block"
          >
            Chrome 에 추가
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="font-label-md cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 whitespace-nowrap text-black hover:bg-gray-100"
          >
            회원가입/로그인
          </button>
        </div>
      </div>
    </header>
  );
}
