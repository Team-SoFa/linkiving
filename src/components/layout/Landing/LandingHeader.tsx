'use client';

import IcLandingLogo from '@/components/Icons/svgs/ic_landing_ic_logo.svg';
import IcLandingTextLogo from '@/components/Icons/svgs/ic_landing_text_logo.svg';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/dbbkgbbhhhhfpclfdkmomidnkgffpbod?utm_source=item-share-cb';

export default function LandingHeader() {
  const handleAddToChrome = () => {
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleStart = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_API_URL is not configured');
      return;
    }

    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <IcLandingLogo width={36} height={32} />
          <IcLandingTextLogo width={140} height={28} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToChrome}
            className="font-title-sm cursor-pointer rounded-full bg-black px-4 py-2 text-white"
          >
            Chrome에 추가하기
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="font-title-sm cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2 text-black"
          >
            시작하기
          </button>
        </div>
      </div>
    </header>
  );
}
