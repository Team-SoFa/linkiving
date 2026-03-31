'use client';

import { addMessageFeedback } from '@/apis/chatApi';
import CardList from '@/components/basics/CardList/CardList';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import Tab from '@/components/basics/Tab/Tab';
import CopyButton from '@/components/wrappers/CopyButton';
import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import ReportModal from '@/components/wrappers/ReportModal/ReportModal';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import { useState } from 'react';

import AnswerActions, { type AnswerReaction } from '../../(route)/chat/_components/AnswerActions';
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
  messageId?: number | null;
  role: 'user' | 'ai';
  text: string;
  links?: ChatLink[] | null;
  reaction?: AnswerReaction;
};

const MOCK_RESPONSE = {
  content:
    '네이버 쇼핑(플러스 스토어) 접속 오류가 반복될 때는 서비스 공지 확인, 앱/브라우저 재시도, 고객센터 문의 순서로 점검하는 것이 좋습니다. 계정 자체 문제보다는 일시적인 장애일 가능성이 높습니다.',
  links: [
    {
      linkId: 46,
      title: '네이버 쇼핑',
      url: 'https://shopping.naver.com/',
      imageUrl:
        'https://linkiving-s3.s3.ap-northeast-2.amazonaws.com/links/5a4d2bc9-9159-35ac-b162-f882605fcbfb.png',
      summary:
        '네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.네이버 쇼핑 서비스 현황 및 공지 확인용 예시 링크입니다.',
    },
  ] as ChatLink[],
};

const createAiMockMessage = (): ChatMessage => ({
  id: `${Date.now()}-${crypto.randomUUID()}`,
  messageId: Date.now(),
  role: 'ai',
  text: MOCK_RESPONSE.content,
  links: MOCK_RESPONSE.links,
  reaction: null,
});

export default function MockChatPage() {
  const modal = useModalStore(state => state.modal);
  const openModal = useModalStore(state => state.open);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'mock-initial',
      messageId: 1,
      role: 'ai',
      text: '목업 채팅 페이지입니다. 질문을 보내면 API 없이 고정 응답이 바로 표시됩니다.',
      links: MOCK_RESPONSE.links,
      reaction: null,
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

  const handleReactionChange = async (message: ChatMessage, reaction: AnswerReaction) => {
    const previousReaction = message.reaction ?? null;
    setMessages(prev => prev.map(item => (item.id === message.id ? { ...item, reaction } : item)));

    if (message.messageId == null) {
      showToast({
        message: '피드백을 전송할 메시지 ID를 찾을 수 없습니다.',
        variant: 'error',
        showIcon: true,
      });
      setMessages(prev =>
        prev.map(item => (item.id === message.id ? { ...item, reaction: previousReaction } : item))
      );
      return;
    }

    const sentiment = reaction === 'up' ? 'LIKE' : reaction === 'down' ? 'DISLIKE' : 'NONE';

    try {
      await addMessageFeedback(message.messageId, { sentiment, text: '' });
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
      setMessages(prev =>
        prev.map(item => (item.id === message.id ? { ...item, reaction: previousReaction } : item))
      );
      showToast({
        message: (err as Error).message ?? '피드백 전송에 실패했습니다.',
        variant: 'error',
        showIcon: true,
      });
    }
  };

  const handleRegenerate = () => {
    showToast({
      message: '재생성 기능은 목업에서 준비 중입니다.',
      variant: 'info',
      showIcon: true,
    });
  };

  const handleMore = () => {
    openModal('REPORT');
  };

  return (
    <div className="h-screen w-full xl:flex">
      <div className="custom-scrollbar min-w-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
        <div className="mx-auto flex h-screen w-full max-w-[816px] flex-col px-4 pt-6">
          <div className="flex min-h-0 flex-1 flex-col gap-3 pb-42">
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
                                      summary={link.summary ?? ''}
                                      imageUrl={link.imageUrl ?? ''}
                                      onClick={() => setSelectedLink(link)}
                                    />
                                  ))}
                                </CardList>
                              </div>
                            )}
                            <div className="mt-3">
                              <AnswerActions
                                copyValue={message.text}
                                menuKey={`answer-more-${message.id}`}
                                reaction={message.reaction ?? null}
                                onReactionChange={reaction =>
                                  void handleReactionChange(message, reaction)
                                }
                                onRegenerate={handleRegenerate}
                                onReport={handleMore}
                              />
                            </div>
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
      {modal.type === 'REPORT' && <ReportModal />}
    </div>
  );
}
