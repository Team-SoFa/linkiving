'use client';

import InfiniteScroll from '@/components/basics/InfiniteScroll/InfiniteScroll';
import { useChatStream } from '@/hooks/server/Chats/useChatStream';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

import ChatQueryBox from '../_components/ChatQueryBox';

type ChatMessage = {
  id: string;
  role: 'user' | 'ai' | 'system';
  text: string;
};

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);
  const initialQuestion = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams]);
  const initialSentRef = useRef(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [streamError, setStreamError] = useState<string | null>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [isLoadingMore] = useState(false);
  const [hasMore] = useState(false);

  const finalizeStream = () => {
    setStreamBuffer(prev => {
      if (!prev) return '';
      const text = prev;
      setMessages(prevMessages => [
        ...prevMessages,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'ai', text },
      ]);
      return '';
    });
  };

  const { connected, send } = useChatStream({
    chatId,
    enabled: Boolean(chatId),
    onChunk: (chunk: string) => {
      if (chunk === 'END_OF_STREAM') return;
      setStreamBuffer(prev => prev + chunk);
    },
    onEnd: () => finalizeStream(),
    onConnect: () => {
      console.log('socket connected');
      setStreamError(null);
      if (!initialQuestion || initialSentRef.current) return;
      initialSentRef.current = true;
      setMessages(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'user', text: initialQuestion },
      ]);
      setStreamBuffer('');
      send(initialQuestion);
      router.replace(`/chat/${chatId}`);
    },
    onDisconnect: () => {
      setStreamError('소켓 연결이 종료되었습니다.');
      finalizeStream();
    },
    onError: (err: unknown) => {
      setStreamError((err as Error).message ?? '소켓 연결 중 오류가 발생했습니다.');
      finalizeStream();
    },
  });

  const handleSubmit = (value: string) => {
    if (!connected) {
      setStreamError('소켓이 연결되지 않았습니다.');
      return;
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'user', text: trimmedValue },
    ]);
    setStreamBuffer('');
    try {
      send(trimmedValue);
    } catch (err) {
      setStreamError((err as Error).message ?? '메시지 전송에 실패했습니다.');
    }
  };

  const handleLoadMore = useCallback(async () => {}, []);
  const handleSetScrollRoot = useCallback((node: HTMLDivElement | null) => {
    setScrollRoot(node);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      <div className="mx-auto flex w-full max-w-[816px] flex-1 flex-col px-4 pt-6">
        {streamError && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-red500 text-sm">{streamError}</div>
          </div>
        )}
        <div
          ref={handleSetScrollRoot}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-42"
        >
          <InfiniteScroll
            root={scrollRoot}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            loader={<></>}
            endMessage={<></>}
          >
            {messages.length === 0 && !streamBuffer && (
              <div className="text-gray500 text-sm">질문을 입력하면 응답이 표시됩니다.</div>
            )}
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex text-sm ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'user' ? (
                  <div className="bg-blue50 text-gray900 max-w-[70%] rounded-2xl px-4 py-3 whitespace-pre-wrap">
                    {message.text}
                  </div>
                ) : (
                  <div className="text-gray700 max-w-[70%] px-1 py-1 whitespace-pre-wrap">
                    {message.text}
                  </div>
                )}
              </div>
            ))}
            {streamBuffer && (
              <div className="flex justify-start text-sm">
                <div className="text-gray900 max-w-[70%] px-1 py-1 whitespace-pre-wrap">
                  {streamBuffer}
                  <span className="ml-1 animate-pulse">▍</span>
                </div>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <div className="relative z-10 mb-15 flex w-full justify-center px-4">
        <div className="w-full max-w-[816px] shrink-0">
          <ChatQueryBox onSubmit={handleSubmit} disabled={!connected} />
        </div>
      </div>
    </div>
  );
}
