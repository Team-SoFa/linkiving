'use client';

import GreetingBlock from '@/components/basics/GreetingBlock/GreetingBlock';
import QueryBox from '@/components/wrappers/QueryBox/QueryBox';
import { useRouter } from 'next/navigation';

export default function Home() {
  const route = useRouter();
  return (
    <div className="mt-50 flex flex-col items-center gap-15">
      <GreetingBlock />
      <div className="w-180">
        <QueryBox
          onSubmit={() => {
            alert('submit');
            route.push('/chat');
          }}
        />
      </div>
      <div className="flex gap-7">
        <span className="flex h-15 w-40 items-center justify-center rounded-2xl bg-gray-200">
          menu
        </span>
        <span className="flex h-15 w-40 items-center justify-center rounded-2xl bg-gray-200">
          menu
        </span>
        <span className="flex h-15 w-40 items-center justify-center rounded-2xl bg-gray-200">
          menu
        </span>
        <span className="flex h-15 w-40 items-center justify-center rounded-2xl bg-gray-200">
          menu
        </span>
      </div>
    </div>
  );
}
