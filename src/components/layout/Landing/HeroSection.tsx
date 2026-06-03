import { ChromeButton } from '@/components/wrappers/ChromeButton';
import { GoogleLoginButton } from '@/components/wrappers/GoogleLoginButton';
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
      <div className="relative z-10 mx-auto flex w-full flex-col items-center gap-12 px-6 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
        <div className="flex w-full flex-col lg:w-[462px] lg:shrink-0">
          <span className="mb-5 flex flex-col text-[40px] font-semibold">
            <span>똑똑하게 관리하는</span>
            <span>나만의 북마크 저장소</span>
          </span>
          <span className="font-body-lg mb-7 flex flex-col">
            <span>저장만 하고 다시 찾지 못한 북마크 링크를</span>
            <span>이제 링카이빙이 함께 정리하고, 바로 찾아드릴게요</span>
          </span>
          <div className="flex flex-col gap-4.5">
            <ChromeButton />
            <GoogleLoginButton />
          </div>
        </div>
        <div className="w-full lg:max-w-[760px]">
          <Image
            src="/images/landing-1.png"
            alt="링카이빙 채팅 화면"
            width={760}
            height={376}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
