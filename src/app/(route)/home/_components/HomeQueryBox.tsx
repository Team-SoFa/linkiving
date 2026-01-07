'use client';

import QueryBox from '@/components/wrappers/QueryBox';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCreateChatRoom } from './useCreateChatRoom';

type CreateChatHook = ReturnType<typeof useCreateChatRoom>;

interface Props {
  createChat: CreateChatHook;
  onRedirecting: () => void;
}

export default function HomeQueryBox({ createChat, onRedirecting }: Props) {
  const [value, setValue] = useState('');
  const route = useRouter();
  const { submit, creating } = createChat;

  const handleSubmit = async () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || creating) return;
    const chatRoom = await submit({ firstChat: trimmedValue });
    if (!chatRoom) return;

    onRedirecting();
    if (chatRoom) route.push(`/chat/${chatRoom.id}?q=${encodeURIComponent(trimmedValue)}`);
  };

  return <QueryBox value={value} onChange={setValue} onSubmit={handleSubmit} />;
}
