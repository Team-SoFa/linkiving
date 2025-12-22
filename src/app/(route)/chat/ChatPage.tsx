'use client';

import HomeQueryBox from '@/app/(route)/home/_components/HomeQueryBox/HomeQueryBox';
import CardList from '@/components/basics/CardList/CardList';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import Tab from '@/components/basics/Tab/Tab';
import UserChatBox from '@/components/wrappers/UserChatBox/UserChatBox';
import { chatHistoryById, chatLinksById, chatReasoningById, mockChats } from '@/mocks';
import { useChatRightPanelStore } from '@/stores/chatRightPanelStore';
import { useChatStore } from '@/stores/chatStore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function Chat() {
  const params = useSearchParams();
  const { setChats, setActiveChat } = useChatStore();
  const { setSelectedLink } = useChatRightPanelStore();
  const [message, setMessage] = useState('');
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

  const activeId = useMemo(() => {
    const param = params.get('chatId');
    const parsed = param ? Number(param) : NaN;
    if (!Number.isNaN(parsed)) return parsed;
    return useMockData ? (mockChats[0]?.id ?? null) : null;
  }, [params, useMockData]);

  useEffect(() => {
    setChats(useMockData ? mockChats : []);
  }, [setChats, useMockData]);

  useEffect(() => {
    if (activeId !== null) {
      setActiveChat(activeId);
    }
  }, [activeId, setActiveChat]);

  const messages = useMemo(() => {
    if (!useMockData || activeId === null) return [];
    return chatHistoryById[activeId] ?? [];
  }, [activeId, useMockData]);
  const chatPairs = useMemo(() => {
    const pairs: {
      user: (typeof messages)[number];
      assistant?: (typeof messages)[number];
    }[] = [];
    let pendingUser: (typeof messages)[number] | null = null;

    messages.forEach(message => {
      if (message.role === 'user') {
        if (pendingUser) {
          pairs.push({ user: pendingUser });
        }
        pendingUser = message;
      } else if (message.role === 'assistant') {
        if (pendingUser) {
          pairs.push({ user: pendingUser, assistant: message });
          pendingUser = null;
        }
      }
    });

    if (pendingUser) {
      pairs.push({ user: pendingUser });
    }

    return pairs;
  }, [messages]);
  const linkCards = activeId && useMockData ? (chatLinksById[activeId] ?? []) : [];
  const reasoning = activeId && useMockData ? chatReasoningById[activeId] : undefined;
  return (
    <div className="min-h-screen w-full px-6 py-6">
      <section className="mx-auto flex w-full max-w-200 min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {chatPairs.length === 0 ? (
            <p className="text-gray400 text-sm">요청을 입력해 보세요.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {chatPairs.map(({ user, assistant }) => (
                <div key={user.id} className="space-y-6">
                  <div className="flex justify-end">
                    <div className="bg-blue50 text-gray900 max-w-[560px] rounded-2xl px-4 py-3 text-sm leading-[160%]">
                      {user.content}
                    </div>
                  </div>
                  <Tab
                    tabs={['답변', '링크', '단계']}
                    contents={{
                      답변: (
                        <div className="space-y-6">
                          <div className="text-gray900 space-y-4 text-sm leading-[160%]">
                            <p>
                              {reasoning?.answer ?? assistant?.content ?? '응답을 생성 중입니다.'}
                            </p>
                          </div>
                          <div>
                            {linkCards.length === 0 ? (
                              <p className="text-gray400 text-sm">표시할 링크가 없습니다.</p>
                            ) : (
                              <CardList>
                                {linkCards.map(link => (
                                  <LinkCard
                                    key={`${user.id}-${link.id}`}
                                    title={link.title}
                                    link={link.url}
                                    summary={link.summary}
                                    imageUrl={link.imageUrl ?? ''}
                                    onClick={() => setSelectedLink(link)}
                                  />
                                ))}
                              </CardList>
                            )}
                          </div>
                        </div>
                      ),
                      링크: (
                        <div>
                          {linkCards.length === 0 ? (
                            <p className="text-gray400 text-sm">표시할 링크가 없습니다.</p>
                          ) : (
                            <CardList>
                              {linkCards.map(link => (
                                <LinkCard
                                  key={`${user.id}-link-${link.id}`}
                                  title={link.title}
                                  link={link.url}
                                  summary={link.summary}
                                  imageUrl={link.imageUrl ?? ''}
                                  onClick={() => setSelectedLink(link)}
                                />
                              ))}
                            </CardList>
                          )}
                        </div>
                      ),
                      단계: (
                        <ol className="text-gray700 space-y-4 text-sm">
                          {reasoning?.reasoningSteps?.length
                            ? reasoning.reasoningSteps.map((step, index) => {
                                const relatedLinks = linkCards.filter(link =>
                                  step.linkIds.includes(link.id)
                                );

                                return (
                                  <li key={`${user.id}-step-${index}`} className="space-y-2">
                                    <p className="text-gray900 font-medium">
                                      {index + 1}. {step.step}
                                    </p>
                                    {relatedLinks.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        {relatedLinks.map(link => (
                                          <button
                                            key={`${user.id}-step-link-${link.id}`}
                                            type="button"
                                            onClick={() => setSelectedLink(link)}
                                            className="text-gray500 hover:text-gray900 border-gray200 rounded-full border px-3 py-1 text-xs"
                                          >
                                            {link.title}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </li>
                                );
                              })
                            : null}
                        </ol>
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-gray200 bg-white px-6 py-4">
          <div className="hidden xl:flex">
            <HomeQueryBox />
          </div>
          <div className="flex xl:hidden">
            <UserChatBox
              value={message}
              onChange={e => setMessage(e.target.value)}
              onSubmit={() => setMessage('')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
