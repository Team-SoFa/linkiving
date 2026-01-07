'use client';

import Spinner from '@/components/basics/Spinner/Spinner';
import { useState } from 'react';

import ChatQueryBox from '../chat/_components/ChatQueryBox';
import GreetingBlock from './_components/GreetingBlock/GreetingBlock';
import HomeQueryBox from './_components/HomeQueryBox';
import { useCreateChatRoom } from './_components/useCreateChatRoom';

export default function Home() {
  const createChat = useCreateChatRoom();
  const { creating, form, error } = createChat;
  const [redirecting, setRedirecting] = useState(false);

  // 로딩중 화면
  if (creating || redirecting) {
    return (
      <div className="flex h-screen w-full justify-center">
        <div className="relative flex h-full w-full max-w-[816px] flex-1 flex-col px-4">
          <span className="bg-blue50 absolute top-6 right-0 max-w-[70%] rounded-2xl px-4 py-3 whitespace-pre-wrap">
            {form.firstChat}
          </span>
          <div className="absolute top-20 left-0 mx-4 mt-6 flex items-center justify-center gap-2 px-4 py-3">
            <Spinner width={18} height={18} />
            <span className="font-body-md text-gray500">답변을 생성하고 있어요.</span>
          </div>
          {error && <p className="absolute top-0 left-0 text-red-500">문제가 발생했습니다.</p>}
        </div>
        <div className="fixed bottom-10 left-1/2 flex w-full max-w-[816px] -translate-x-1/2">
          <ChatQueryBox onSubmit={() => {}} disabled />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mb-7 ml-4 flex w-full max-w-184 flex-col">
        <div className="font-title-md ml-6 flex flex-col gap-1.5 md:flex-row">
          <span>저장한 링크 속 내용을 바탕으로</span>
          <span> 답변해 드려요.</span>
        </div>
        <GreetingBlock context="default" />
      </div>
      <div className="w-full max-w-184 px-4">
        {error && (
          <p className="mb-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <HomeQueryBox createChat={createChat} onRedirecting={() => setRedirecting(true)} />
      </div>
    </div>
  );
}
