'use client';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/dbbkgbbhhhhfpclfdkmomidnkgffpbod?utm_source=item-share-cb';

export function ChromeButton() {
  const handleClick = () => {
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="hover:bg-gray800 flex cursor-pointer items-center justify-center rounded-full bg-black py-[14.5px] text-white"
    >
      <span className="text-[18px] font-semibold">Chrome 웹스토어로 바로가기</span>
    </button>
  );
}
