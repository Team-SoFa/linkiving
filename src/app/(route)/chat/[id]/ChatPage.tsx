'use client';

import ChatQueryBox from '../_components/ChatQueryBox';

export default function Chat() {
  return (
    <div className="relative flex h-screen w-full items-center">
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2">
        <ChatQueryBox onSubmit={() => {}} />
      </div>
    </div>
  );
}
