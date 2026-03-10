'use client';

import { addMessageFeedback, fetchChatMessages } from '@/apis/chatApi';
import type { ChatSocketLink, ChatSocketMessage } from '@/apis/chatSocket';
import CardList from '@/components/basics/CardList/CardList';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import Tab from '@/components/basics/Tab/Tab';
import CopyButton from '@/components/wrappers/CopyButton';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import ReportModal from '@/components/wrappers/ReportModal/ReportModal';
import { useChatStream } from '@/hooks/server/Chats/useChatStream';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import type { ChatHistoryMessage } from '@/types/api/chatApi';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AnswerActions, { type AnswerReaction } from '../_components/AnswerActions';
import ChatQueryBox from '../_components/ChatQueryBox';

type ChatMessage = {
  id: string;
  messageId?: number | null;
  role: 'user' | 'ai' | 'system';
  text: string;
  links?: ChatSocketLink[] | null;
  reaction?: AnswerReaction;
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

const toReaction = (feedback?: string | null): AnswerReaction => {
  if (feedback === 'LIKE') return 'up';
  if (feedback === 'DISLIKE') return 'down';
  return null;
};

const mapHistoryMessage = (message: ChatHistoryMessage): ChatMessage => ({
  id: `history-${message.id}`,
  messageId: message.id,
  role: message.type === 'USER' ? 'user' : 'ai',
  text: message.content,
  links: toLinks(message.links),
  reaction: toReaction(message.feedback),
});

const normalizeMessageText = (text: string) => text.trim();

const mergeAiText = (prevText: string, nextText: string) => {
  if (!prevText) return nextText;
  if (!nextText) return prevText;
  if (nextText.startsWith(prevText)) return nextText;
  if (prevText.endsWith(nextText)) return prevText;
  return `${prevText}${nextText}`;
};

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);
  const chatIdNum = useMemo(() => Number(chatId), [chatId]);
  const initialQuestion = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams]);
  const initialSentRef = useRef(false);
  const modal = useModalStore(state => state.modal);
  const openModal = useModalStore(state => state.open);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<ChatSocketLink | null>(null);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [historyHasNext, setHistoryHasNext] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyBootstrapped, setHistoryBootstrapped] = useState(false);

  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollAdjustRef = useRef<{ oldHeight: number; oldTop: number } | null>(null);
  const olderHistoryInFlightRef = useRef(false);
  const historyRequestSeqRef = useRef(0);
  const reactionRequestSeqRef = useRef<Record<string, number>>({});

  const appendAiMessage = useCallback((payload: ChatSocketMessage) => {
    setMessages(prev => {
      const nextContent = payload.content ?? '';
      const nextLinks = payload.links ?? null;

      if (payload.messageId !== null) {
        const sameMessageIndex = prev.findIndex(
          message => message.role === 'ai' && message.messageId === payload.messageId
        );

        if (sameMessageIndex >= 0) {
          return prev.map((message, index) =>
            index === sameMessageIndex
              ? {
                  ...message,
                  text: mergeAiText(message.text, nextContent),
                  links: nextLinks ?? message.links ?? null,
                }
              : message
          );
        }

        const unresolvedIndex = [...prev]
          .reverse()
          .findIndex(message => message.role === 'ai' && (message.messageId ?? null) === null);

        if (unresolvedIndex >= 0) {
          const targetIndex = prev.length - 1 - unresolvedIndex;
          return prev.map((message, index) =>
            index === targetIndex
              ? {
                  ...message,
                  messageId: payload.messageId,
                  text: mergeAiText(message.text, nextContent),
                  links: nextLinks ?? message.links ?? null,
                }
              : message
          );
        }
      } else {
        const lastAiIndex = [...prev]
          .reverse()
          .findIndex(message => message.role === 'ai' && (message.messageId ?? null) === null);

        if (lastAiIndex >= 0) {
          const targetIndex = prev.length - 1 - lastAiIndex;
          return prev.map((message, index) =>
            index === targetIndex
              ? {
                  ...message,
                  text: mergeAiText(message.text, nextContent),
                  links: nextLinks ?? message.links ?? null,
                }
              : message
          );
        }
      }

      return [
        ...prev,
        {
          id: `${Date.now()}-${crypto.randomUUID()}`,
          messageId: payload.messageId,
          role: 'ai',
          text: nextContent,
          links: nextLinks,
          reaction: null,
        },
      ];
    });
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

      setStreamError('답변 생성에 실패했습니다.');
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}-${crypto.randomUUID()}`,
          role: 'system',
          text: '답변 생성에 실패했습니다.',
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

    const requestSeq = historyRequestSeqRef.current + 1;
    historyRequestSeqRef.current = requestSeq;
    setHistoryLoading(true);
    setHistoryBootstrapped(false);
    try {
      const data = await fetchChatMessages({ chatId: chatIdNum, size: PAGE_SIZE, lastId: null });
      if (requestSeq !== historyRequestSeqRef.current) return;
      const normalized = data.messages.map(mapHistoryMessage).reverse();
      setMessages(prev => {
        const historyIds = new Set(normalized.map(message => message.id));
        const historyUserTexts = new Set(
          normalized
            .filter(message => message.role === 'user')
            .map(message => normalizeMessageText(message.text))
        );
        const latestLive = prev.filter(message => !historyIds.has(message.id));
        const mergedLive = latestLive.filter(message => {
          if (message.role !== 'user') return true;
          return !historyUserTexts.has(normalizeMessageText(message.text));
        });
        return [...normalized, ...mergedLive];
      });
      setHistoryCursor(data.lastId ?? null);
      setHistoryHasNext(Boolean(data.hasNext));
      setHistoryBootstrapped(true);

      requestAnimationFrame(() => {
        const root = scrollRootRef.current;
        if (!root) return;
        root.scrollTop = root.scrollHeight;
      });
    } catch (err) {
      if (requestSeq !== historyRequestSeqRef.current) return;
      setStreamError((err as Error).message ?? '채팅 기록을 불러오지 못했습니다.');
      setHistoryBootstrapped(true);
    } finally {
      if (requestSeq === historyRequestSeqRef.current) {
        setHistoryLoading(false);
      }
    }
  }, [chatId, chatIdNum]);

  const loadOlderHistory = useCallback(async () => {
    if (!chatId || Number.isNaN(chatIdNum)) return;
    if (!historyHasNext || olderHistoryInFlightRef.current) return;

    const root = scrollRootRef.current;
    const oldHeight = root?.scrollHeight ?? 0;
    const oldTop = root?.scrollTop ?? 0;
    const requestSeq = historyRequestSeqRef.current;

    olderHistoryInFlightRef.current = true;
    setHistoryLoading(true);
    try {
      const data = await fetchChatMessages({
        chatId: chatIdNum,
        size: PAGE_SIZE,
        lastId: historyCursor,
      });
      if (requestSeq !== historyRequestSeqRef.current) return;
      const older = data.messages.map(mapHistoryMessage).reverse();
      if (older.length > 0) {
        pendingScrollAdjustRef.current = { oldHeight, oldTop };
        setMessages(prev => {
          const existingIds = new Set(prev.map(message => message.id));
          const uniqueOlder = older.filter(message => !existingIds.has(message.id));
          return [...uniqueOlder, ...prev];
        });
      }
      setHistoryCursor(data.lastId ?? null);
      setHistoryHasNext(Boolean(data.hasNext));
    } catch (err) {
      if (requestSeq !== historyRequestSeqRef.current) return;
      setStreamError((err as Error).message ?? '이전 기록을 불러오지 못했습니다.');
    } finally {
      olderHistoryInFlightRef.current = false;
      if (requestSeq === historyRequestSeqRef.current) {
        setHistoryLoading(false);
      }
    }
  }, [chatId, chatIdNum, historyCursor, historyHasNext]);

  useEffect(() => {
    historyRequestSeqRef.current += 1;
    olderHistoryInFlightRef.current = false;
    initialSentRef.current = false;
    setStreamError(null);
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

  const handleReactionChange = useCallback(
    async (message: ChatMessage, reaction: AnswerReaction) => {
      const previousReaction = message.reaction ?? null;
      const requestSeq = (reactionRequestSeqRef.current[message.id] ?? 0) + 1;
      reactionRequestSeqRef.current[message.id] = requestSeq;

      setMessages(prev =>
        prev.map(item => (item.id === message.id ? { ...item, reaction } : item))
      );

      if (message.messageId == null) {
        showToast({
          message: '피드백을 전송할 메시지 ID를 찾을 수 없습니다.',
          variant: 'error',
          showIcon: true,
        });
        setMessages(prev =>
          prev.map(item =>
            item.id === message.id ? { ...item, reaction: previousReaction } : item
          )
        );
        return;
      }

      const sentiment = reaction === 'up' ? 'LIKE' : reaction === 'down' ? 'DISLIKE' : 'NONE';

      try {
        await addMessageFeedback(message.messageId, {
          sentiment,
          text: '',
        });

        if (reactionRequestSeqRef.current[message.id] !== requestSeq) return;

        if (reaction === 'up') {
          showToast({
            message: '감사합니다. 제공해 주신 피드백은 Linkiving을 개선하는 데 도움이 됩니다.',
            variant: 'info',
            showIcon: true,
          });
        }

        if (reaction === 'down') {
          showToast({
            message: '아쉬운 점을 알려주셔서 감사합니다. 더 나은 답변을 위해 개선하겠습니다.',
            variant: 'info',
            showIcon: true,
          });
        }
      } catch (err) {
        if (reactionRequestSeqRef.current[message.id] !== requestSeq) return;

        setMessages(prev =>
          prev.map(item =>
            item.id === message.id ? { ...item, reaction: previousReaction } : item
          )
        );
        showToast({
          message: (err as Error).message ?? '피드백 전송에 실패했습니다.',
          variant: 'error',
          showIcon: true,
        });
      }
    },
    []
  );

  const handleRegenerate = useCallback(() => {
    showToast({
      message: '재생성 기능은 준비 중입니다.',
      variant: 'info',
      showIcon: true,
    });
  }, []);

  const handleReport = useCallback(() => {
    openModal('REPORT');
  }, [openModal]);

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
                  <div className="max-w-[70%]">
                    <div className="bg-blue50 text-gray900 rounded-2xl px-4 py-3 whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <CopyButton
                        value={message.text}
                        successMsg="질문을 복사했습니다."
                        failMsg="질문 복사에 실패했습니다."
                        tooltipMsg="질문 복사하기"
                        size="sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full rounded-xl border border-gray-200 bg-white p-3">
                    <Tab
                      tabs={['답변', '링크']}
                      contents={{
                        답변: (
                          <div className="text-gray700 text-sm whitespace-pre-wrap">
                            <div>{message.text}</div>
                            {message.links && message.links.length > 0 && (
                              <div className="mt-4">
                                <CardList>
                                  {message.links.map(link => (
                                    <LinkCard
                                      key={link.linkId}
                                      title={link.title}
                                      link={link.url}
                                      summary=""
                                      imageUrl={link.imageUrl ?? ''}
                                      onClick={() => setSelectedLink(link)}
                                    />
                                  ))}
                                </CardList>
                              </div>
                            )}
                            {message.role === 'ai' && (
                              <div className="mt-3">
                                <AnswerActions
                                  copyValue={message.text}
                                  menuKey={`answer-more-${message.id}`}
                                  reaction={message.reaction ?? null}
                                  onReactionChange={reaction =>
                                    void handleReactionChange(message, reaction)
                                  }
                                  onRegenerate={handleRegenerate}
                                  onReport={handleReport}
                                />
                              </div>
                            )}
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
                                    summary=""
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
            id={selectedLink.linkId}
            url={selectedLink.url}
            title={selectedLink.title}
            summary={selectedLink.summary ?? ''}
            imageUrl={selectedLink.imageUrl ?? undefined}
            onClose={() => setSelectedLink(null)}
          />
        </aside>
      )}
      {modal.type === 'REPORT' && <ReportModal />}
    </div>
  );
}
