'use client';

import GreetingBlock from './_components/GreetingBlock/GreetingBlock';
import HomeQueryBox from './_components/HomeQueryBox/HomeQueryBox';

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mb-7 flex w-fit flex-col">
        <div className="font-title-md ml-6 flex flex-col gap-1.5 md:flex-row">
          <span>저장한 링크 속 내용을 바탕으로</span>
          <span> 답변해 드려요.</span>
        </div>
        <GreetingBlock context="default" />
      </div>
      <div className="w-full max-w-184 px-4">
        <HomeQueryBox />
      </div>
    </div>
  );
}
