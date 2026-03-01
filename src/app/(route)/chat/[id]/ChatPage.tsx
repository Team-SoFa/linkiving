'use client';

import { fetchChatMessages } from '@/apis/chatApi';
import type { ChatSocketLink, ChatSocketMessage } from '@/apis/chatSocket';
import CardList from '@/components/basics/CardList/CardList';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import Tab from '@/components/basics/Tab/Tab';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { useChatStream } from '@/hooks/server/Chats/useChatStream';
import type { ChatHistoryMessage } from '@/types/api/chatApi';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ChatQueryBox from '../_components/ChatQueryBox';

type ChatMessage = {
  id: string;
  role: 'user' | 'ai' | 'system';
  text: string;
  links?: ChatSocketLink[] | null;
};

const PAGE_SIZE = 5;

const toLinks = (links: ChatHistoryMessage['links']): ChatSocketLink[] | null => {
  if (!links || links.length === 0) return null;
  return links.map(link => ({
    linkId: link.id,
    title: link.title,
    url: link.url,
    imageUrl: link.imageUrl ?? null,
    summary: link.summary ?? null,
  }));
};

const mapHistoryMessage = (message: ChatHistoryMessage): ChatMessage => ({
  id: `history-${message.id}`,
  role: message.type === 'USER' ? 'user' : 'ai',
  text: message.content,
  links: toLinks(message.links),
});

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);
  const chatIdNum = useMemo(() => Number(chatId), [chatId]);
  const initialQuestion = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams]);
  const initialSentRef = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<ChatSocketLink | null>(null);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [historyHasNext, setHistoryHasNext] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyBootstrapped, setHistoryBootstrapped] = useState(false);

  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollAdjustRef = useRef<{ oldHeight: number; oldTop: number } | null>(null);

  const appendAiMessage = useCallback((payload: ChatSocketMessage) => {
    setMessages(prev => [
      ...prev,
      {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        role: 'ai',
        text: payload.content,
        links: payload.links,
      },
    ]);
  }, []);

  const { connected, send } = useChatStream({
    chatId,
    enabled: Boolean(chatId),
    onMessage: payload => {
      if (String(payload.chatId) !== chatId) return;

      if (payload.success) {
        appendAiMessage(payload);
        setStreamError(null);
        return;
      }

      setStreamError(payload.content || '답변 생성에 실패했습니다.');
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}-${crypto.randomUUID()}`,
          role: 'system',
          text: payload.content || '답변 생성에 실패했습니다.',
          links: payload.links,
        },
      ]);
    },
    onConnect: () => {
      setStreamError(null);
      if (!initialQuestion || initialSentRef.current) return;
      initialSentRef.current = true;
      setMessages(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'user', text: initialQuestion },
      ]);
      send(initialQuestion);
      router.replace(`/chat/${chatId}`);
    },
    onDisconnect: () => {
      setStreamError('소켓 연결이 종료되었습니다.');
    },
    onError: (err: unknown) => {
      setStreamError((err as Error).message ?? '소켓 연결 중 오류가 발생했습니다.');
    },
  });

  const loadInitialHistory = useCallback(async () => {
    if (!chatId || Number.isNaN(chatIdNum)) return;

    setHistoryLoading(true);
    setHistoryBootstrapped(false);
    try {
      const data = await fetchChatMessages({ chatId: chatIdNum, size: PAGE_SIZE, lastId: null });
      const normalized = data.messages.map(mapHistoryMessage).reverse();
      setMessages(normalized);
      setHistoryCursor(data.lastId ?? null);
      setHistoryHasNext(Boolean(data.hasNext));
      setHistoryBootstrapped(true);

      requestAnimationFrame(() => {
        const root = scrollRootRef.current;
        if (!root) return;
        root.scrollTop = root.scrollHeight;
      });
    } catch (err) {
      setStreamError((err as Error).message ?? '채팅 기록을 불러오지 못했습니다.');
      setHistoryBootstrapped(true);
    } finally {
      setHistoryLoading(false);
    }
  }, [chatId, chatIdNum]);

  const loadOlderHistory = useCallback(async () => {
    if (!chatId || Number.isNaN(chatIdNum)) return;
    if (!historyHasNext || historyLoading) return;

    const root = scrollRootRef.current;
    const oldHeight = root?.scrollHeight ?? 0;
    const oldTop = root?.scrollTop ?? 0;

    setHistoryLoading(true);
    try {
      const data = await fetchChatMessages({
        chatId: chatIdNum,
        size: PAGE_SIZE,
        lastId: historyCursor,
      });
      const older = data.messages.map(mapHistoryMessage).reverse();
      if (older.length > 0) {
        pendingScrollAdjustRef.current = { oldHeight, oldTop };
        setMessages(prev => [...older, ...prev]);
      }
      setHistoryCursor(data.lastId ?? null);
      setHistoryHasNext(Boolean(data.hasNext));
    } catch (err) {
      setStreamError((err as Error).message ?? '이전 기록을 불러오지 못했습니다.');
    } finally {
      setHistoryLoading(false);
    }
  }, [chatId, chatIdNum, historyCursor, historyHasNext, historyLoading]);

  useEffect(() => {
    initialSentRef.current = false;
    setSelectedLink(null);
    setMessages([]);
    setHistoryCursor(null);
    setHistoryHasNext(false);
    void loadInitialHistory();
  }, [chatId, loadInitialHistory]);

  useEffect(() => {
    const adjust = pendingScrollAdjustRef.current;
    if (!adjust) return;
    const root = scrollRootRef.current;
    if (!root) return;

    requestAnimationFrame(() => {
      const newHeight = root.scrollHeight;
      root.scrollTop = newHeight - adjust.oldHeight + adjust.oldTop;
      pendingScrollAdjustRef.current = null;
    });
  }, [messages]);

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

    try {
      send(trimmedValue);
    } catch (err) {
      setStreamError((err as Error).message ?? '메시지 전송에 실패했습니다.');
    }
  };

  const handleScroll = useCallback(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    if (root.scrollTop <= 40) {
      void loadOlderHistory();
    }
  }, [loadOlderHistory]);

  return (
    <div className="h-screen w-full xl:flex">
      <div className="min-w-0 flex-1">
        <div className="mx-auto flex h-screen w-full max-w-[816px] flex-col px-4 pt-6">
          {streamError && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-red500 text-sm">{streamError}</div>
            </div>
          )}

          <div
            ref={scrollRootRef}
            onScroll={handleScroll}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-42"
          >
            {historyLoading && historyBootstrapped && (
              <div className="text-gray500 text-center text-xs">이전 대화를 불러오는 중...</div>
            )}

            {messages.length === 0 && !historyLoading && (
              <div className="text-gray500 text-sm">질문을 입력하면 답변이 표시됩니다.</div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex text-sm ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } ${index > 0 ? 'mt-[2rem]' : ''}`}
              >
                {message.role === 'user' ? (
                  <div className="bg-blue50 text-gray900 max-w-[70%] rounded-2xl px-4 py-3 whitespace-pre-wrap">
                    {message.text}
                  </div>
                ) : (
                  <div className="max-w-[92%] rounded-xl border border-gray-200 bg-white p-3">
                    <Tab
                      tabs={['답변', '링크']}
                      contents={{
                        답변: (
                          <div className="text-gray700 text-sm whitespace-pre-wrap">
                            {message.text}
                          </div>
                        ),
                        링크: (
                          <div className="pt-1">
                            {message.links && message.links.length > 0 ? (
                              <CardList>
                                {message.links.map(link => (
                                  <LinkCard
                                    key={link.linkId}
                                    title={link.title}
                                    link={link.url}
                                    summary={link.summary ?? ''}
                                    imageUrl={link.imageUrl ?? ''}
                                    onClick={() => setSelectedLink(link)}
                                  />
                                ))}
                              </CardList>
                            ) : (
                              <div className="text-gray500 text-sm">표시할 링크가 없습니다.</div>
                            )}
                          </div>
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="relative z-10 mb-15 flex w-full justify-center px-4">
            <div className="w-full max-w-[816px] shrink-0">
              <ChatQueryBox onSubmit={handleSubmit} disabled={!connected} />
            </div>
          </div>
        </div>
      </div>

      {selectedLink && (
        <aside className="border-gray200 hidden h-screen shrink-0 border-l xl:block xl:w-130">
          <LinkCardDetailPanel
            url={selectedLink.url}
            title={selectedLink.title}
            summary={selectedLink.summary ?? ''}
            imageUrl={selectedLink.imageUrl ?? undefined}
            onClose={() => setSelectedLink(null)}
          />
        </aside>
      )}
    </div>
  );
}
