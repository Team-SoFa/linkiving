import { ChromeButton } from '@/components/wrappers/ChromeButton';
import Image from 'next/image';

export default function HeroSection() {
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
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 px-6 md:flex-row md:items-center md:justify-between md:gap-16">
        <div className="flex w-full flex-col md:max-w-[462px]">
          <span className="font-display mb-5 flex flex-col">
            <span>똑똑하게 관리하는</span>
            <span>나만의 북마크 저장소</span>
          </span>
          <span className="font-title-md mb-7 flex flex-col">
            <span>저장만 하고 다시 찾지 못한 북마크 링크를</span>
            <span>이제 링카이빙이 함께 정리하고, 바로 찾아드릴게요</span>
          </span>
          <ChromeButton />
        </div>
        <div className="relative aspect-900/508 w-full max-w-[775px]">
          <Image
            src="/images/landing-1.png"
            alt="링카이빙 채팅 화면"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
