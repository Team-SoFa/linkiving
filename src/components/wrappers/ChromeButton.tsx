'use client';

import Image from 'next/image';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/dbbkgbbhhhhfpclfdkmomidnkgffpbod?utm_source=item-share-cb';

export function ChromeButton() {
  const handleClick = () => {
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="flex cursor-pointer items-center justify-center rounded-full bg-black py-3 text-white"
    >
      <Image
        src="/images/google-icon.png"
        alt="Chrome 로고"
        width={20}
        height={20}
        className="mr-2 inline-block"
      />
      <span>Chrome 웹스토어 추가</span>
    </button>
  );
}
