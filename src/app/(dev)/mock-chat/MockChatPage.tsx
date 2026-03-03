'use client';

import CardList from '@/components/basics/CardList/CardList';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import Tab from '@/components/basics/Tab/Tab';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import { useState } from 'react';

import ChatQueryBox from '../../(route)/chat/_components/ChatQueryBox';

type ChatLink = {
  linkId: number;
  title: string;
  url: string;
  imageUrl: string | null;
  summary: string | null;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  links?: ChatLink[] | null;
};

const MOCK_RESPONSE = {
  content:
    "네이버 쇼핑과 스토어(Plus Store)를 이용하시려면, '네이버+ 스토어' 링크(46)를 확인해 보세요. 현재 접속 시 '잠시 후 다시 확인해주세요' 오류가 표시되지만, 서비스가 정상화될 때까지 잠시 후 재접속하거나 '네이버 쇼핑 본문 바로가기' 및 '네이버홈 쇼핑&페이 고객센터'를 통해 문제 해결을 시도할 수 있습니다. 계정·포인트는 보유 중이므로 영향이 최소화됩니다. 2024년 기준 네이버 쇼핑은 현재 점검 중이니, 쇼핑 전 점검 진행 여부를 꼭 확인하세요.",
  links: [
    {
      linkId: 46,
      title: '네이버+ 스토어',
      url: 'https://shopping.naver.com/',
      imageUrl:
        'https://linkiving-s3.s3.ap-northeast-2.amazonaws.com/links/5a4d2bc9-9159-35ac-b162-f882605fcbfb.png',
      summary:
        '네이버 쇼핑/스토어 안내 및 점검 상황 대응을 위한 임시 목데이터입니다. 서비스 오류 시 잠시 후 재접속하거나 고객센터를 이용하세요.',
    },
  ] as ChatLink[],
};

const createAiMockMessage = (): ChatMessage => ({
  id: `${Date.now()}-${crypto.randomUUID()}`,
  role: 'ai',
  text: MOCK_RESPONSE.content,
  links: MOCK_RESPONSE.links,
});

export default function MockChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'mock-initial',
      role: 'ai',
      text: '임시 채팅 페이지입니다. 질문을 보내면 API 없이 목응답이 즉시 표시됩니다.',
      links: MOCK_RESPONSE.links,
    },
  ]);
  const [selectedLink, setSelectedLink] = useState<ChatLink | null>(null);

  const handleSubmit = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'user', text: trimmedValue },
      createAiMockMessage(),
    ]);
  };

  return (
    <div className="h-screen w-full xl:flex">
      <div className="min-w-0 flex-1">
        <div className="mx-auto flex h-screen w-full max-w-[816px] flex-col px-4 pt-6">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-42">
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
                  <div className="w-full rounded-xl bg-white p-3">
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
              <ChatQueryBox onSubmit={handleSubmit} />
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
    </div>
  );
}
