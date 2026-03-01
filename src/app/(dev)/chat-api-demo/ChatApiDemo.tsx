'use client';

import { createChat, fetchChats } from '@/apis/chatApi';
import type { ChatSocketMessage } from '@/apis/chatSocket';
import Button from '@/components/basics/Button/Button';
import Label from '@/components/basics/Label/Label';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useChatStream } from '@/hooks/server/Chats/useChatStream';
import type { ChatRoom } from '@/types/api/chatApi';
import { useCallback, useEffect, useMemo, useState } from 'react';

const defaultForm = { firstChat: '' };

type StreamLogItem = { id: string; role: 'system' | 'ai'; text: string };

const formatPayload = (payload: ChatSocketMessage) => {
  const stepText = Array.isArray(payload.step) ? payload.step.join(' > ') : payload.step;
  const lines = [
    `success: ${payload.success}`,
    `chatId: ${payload.chatId}`,
    `messageId: ${payload.messageId ?? 'null'}`,
    `content: ${payload.content}`,
  ];

  if (stepText) {
    lines.push(`step: ${stepText}`);
  }

  if (payload.links && payload.links.length > 0) {
    lines.push(`links: ${payload.links.length}`);
  }

  return lines.join('\n');
};

export default function ChatApiDemo() {
  const [form, setForm] = useState(defaultForm);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [streamLog, setStreamLog] = useState<StreamLogItem[]>([]);
  const [question, setQuestion] = useState('');
  const [streamEnabled, setStreamEnabled] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const chatIdForSocket = selectedChatId ?? '';

  const { connected, send, cancel } = useChatStream({
    chatId: chatIdForSocket,
    enabled: streamEnabled && Boolean(chatIdForSocket),
    onMessage: payload => {
      if (payload.chatId !== selectedChatId) return;

      setStreamLog(prev => [
        ...prev,
        {
          id: `${Date.now()}-${crypto.randomUUID()}`,
          role: payload.success ? 'ai' : 'system',
          text: formatPayload(payload),
        },
      ]);

      if (!payload.success) {
        setStreamError(payload.content || '답변 생성 실패');
      } else {
        setStreamError(null);
      }
    },
    onConnect: () => {
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: '소켓 연결됨' },
      ]);
      setStreamError(null);
    },
    onDisconnect: () => {
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: '소켓 연결 해제됨' },
      ]);
    },
    onError: err => {
      const message = (err as Error).message;
      setStreamError(message);
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: `오류: ${message}` },
      ]);
    },
  });

  const loadChats = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await fetchChats();
      setChats(data);
    } catch (e) {
      setListError((e as Error).message);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const created = await createChat(form);
      setChats(prev => [created, ...prev]);
      setForm(defaultForm);
    } catch (e) {
      setCreateError((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const total = useMemo(() => chats.length, [chats]);

  const handleSelectChat = (chat: ChatRoom) => {
    setSelectedChatId(chat.id);
    setStreamEnabled(true);
    setStreamError(null);
    setStreamLog(prev => [
      ...prev,
      {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        role: 'system',
        text: `채팅방 #${chat.id} 연결 시도`,
      },
    ]);
  };

  const handleSend = () => {
    const text = question.trim();
    if (!text || !selectedChatId) return;
    if (!connected) {
      setStreamError('소켓이 연결되지 않았습니다.');
      return;
    }

    setStreamLog(prev => [
      ...prev,
      { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: `질문 전송: ${text}` },
    ]);
    setQuestion('');

    try {
      send(text);
    } catch (err) {
      setStreamError((err as Error).message);
    }
  };

  const handleCancel = () => {
    if (!selectedChatId || !connected) return;

    try {
      cancel();
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: '취소 요청 전송' },
      ]);
    } catch (err) {
      setStreamError((err as Error).message);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Chat API 데모</h1>
        <p className="text-gray600">
          GET `/v1/chats`, POST `/v1/chats`를 확인하고 선택한 채팅방으로 소켓 전송(`/send`)과 취소
          (`/cancel`)를 테스트합니다.
        </p>
      </header>

      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">채팅방 생성 (POST /v1/chats)</h2>
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstChat">firstChat</Label>
            <TextArea
              id="firstChat"
              placeholder="첫 질문"
              value={form.firstChat}
              onChange={e => setForm({ firstChat: e.target.value })}
              heightLines={3}
              maxHeightLines={6}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              label={creating ? '생성 중...' : '채팅 생성'}
              disabled={creating}
            />
            {createError && <span className="text-red500 text-sm">오류: {createError}</span>}
          </div>
        </form>
      </section>

      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">채팅방 목록 (GET /v1/chats)</h2>
            <p className="text-gray600 text-sm">총 {total}개</p>
          </div>
          <Button
            variant="secondary"
            label={listLoading ? '불러오는 중...' : '새로고침'}
            onClick={() => void loadChats()}
            disabled={listLoading}
          />
        </div>
        {listError && <p className="text-red500 text-sm">오류: {listError}</p>}
        <div className="mt-2 grid gap-3">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`border-gray200 flex cursor-pointer flex-col gap-2 rounded-lg border p-3 shadow-sm ${
                selectedChatId === chat.id ? 'border-blue-500' : ''
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-gray500 text-sm">#{chat.id}</span>
                  <span className="text-base font-semibold">{chat.title ?? '(제목 없음)'}</span>
                </div>
                {selectedChatId === chat.id && (
                  <span className="text-sm font-medium text-blue-600">선택됨</span>
                )}
              </div>
              {chat.firstChat && <p className="text-gray700 text-sm">첫질문: {chat.firstChat}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">선택 채팅 소켓</h2>
            <p className="text-gray600 text-sm">
              {selectedChatId ? `채팅방 #${selectedChatId}` : '채팅방을 선택하세요'}{' '}
              {connected ? '(연결됨)' : streamEnabled ? '(연결 중/해제됨)' : '(미연결)'}
            </p>
          </div>
          {selectedChatId && (
            <Button
              variant="secondary"
              label={streamEnabled ? '연결 해제' : '연결'}
              onClick={() => setStreamEnabled(prev => !prev)}
            />
          )}
        </div>

        {selectedChatId && (
          <>
            <div className="mb-3 flex flex-col gap-2">
              <Label htmlFor="question">질문 전송 (/send)</Label>
              <TextArea
                id="question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="질문 입력"
                heightLines={3}
                maxHeightLines={6}
                disabled={!streamEnabled}
              />
              <div className="flex gap-2">
                <Button
                  label="전송"
                  onClick={handleSend}
                  disabled={!streamEnabled || !connected || !question.trim()}
                />
                <Button
                  variant="secondary"
                  label="취소(/cancel)"
                  onClick={handleCancel}
                  disabled={!streamEnabled || !connected}
                />
              </div>
            </div>

            {streamError && <p className="text-red500 text-sm">오류: {streamError}</p>}

            <div className="border-gray200 flex min-h-[200px] flex-col gap-2 rounded-lg border p-3">
              {streamLog.map(item => (
                <div
                  key={item.id}
                  className={`text-sm whitespace-pre-wrap ${
                    item.role === 'ai' ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
