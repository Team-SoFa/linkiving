'use client';

import IcLinkOpen from '@/components/Icons/svgs/ic_link_open.svg';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/dbbkgbbhhhhfpclfdkmomidnkgffpbod?utm_source=item-share-cb';

export function ChromeButton() {
  const handleClick = () => {
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hover:bg-gray800 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black py-[14.5px] text-white"
    >
      <span className="text-[18px] font-semibold whitespace-nowrap">Chrome 확장 프로그램 추가</span>
      <IcLinkOpen aria-hidden="true" width={24} height={24} className="shrink-0" />
    </button>
  );
}
