'use client';

import { createChat, fetchChats } from '@/apis/chatApi';
import Button from '@/components/basics/Button/Button';
import Label from '@/components/basics/Label/Label';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useChatStream } from '@/hooks/server/Chats/useChatStream';
import type { ChatRoom } from '@/types/api/chatApi';
import { useCallback, useEffect, useMemo, useState } from 'react';

const defaultForm = { firstChat: '' };

type StreamLogItem = { id: string; role: 'system' | 'ai'; text: string };

export default function ChatApiDemo() {
  const [form, setForm] = useState(defaultForm);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [streamLog, setStreamLog] = useState<StreamLogItem[]>([]);
  const [question, setQuestion] = useState('');
  const [streamEnabled, setStreamEnabled] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const chatIdForSocket = selectedChatId ?? '';

  const { connected, send } = useChatStream({
    chatId: chatIdForSocket,
    enabled: streamEnabled && Boolean(chatIdForSocket),
    onChunk: chunk => {
      if (chunk === 'END_OF_STREAM') {
        setStreamBuffer(prevBuffer => {
          if (!prevBuffer) return '';
          setStreamLog(prev => [
            ...prev,
            { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'ai', text: prevBuffer },
          ]);
          return '';
        });
        return;
      }
      setStreamBuffer(prev => prev + chunk);
    },
    onConnect: () => {
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: '✅ 소켓 연결됨' },
      ]);
      setStreamError(null);
    },
    onDisconnect: () => {
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: '연결 해제됨' },
      ]);
      setStreamBuffer('');
    },
    onError: err => {
      const message = (err as Error).message;
      setStreamError(message);
      setStreamLog(prev => [
        ...prev,
        { id: `${Date.now()}-${crypto.randomUUID()}`, role: 'system', text: `에러: ${message}` },
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
    setStreamBuffer('');
    setStreamError(null);
    setStreamLog(prev => [
      ...prev,
      {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        role: 'system',
        text: `채팅방 #${chat.id}에 연결을 시도합니다.`,
      },
    ]);
  };

  const handleSend = () => {
    const text = question.trim();
    if (!text || !selectedChatId) return;
    if (!connected) {
      setStreamError('소켓이 연결되지 않았습니다.');
      setStreamLog(prev => [
        ...prev,
        {
          id: `${Date.now()}-${crypto.randomUUID()}`,
          role: 'system',
          text: '❌ 소켓이 미연결 상태입니다.',
        },
      ]);
      return;
    }
    setStreamBuffer('');
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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Chat API 데모</h1>
        <p className="text-gray600">
          GET `/v1/chats` 목록 조회와 POST `/v1/chats` 첫 메시지 생성을 확인하고, 선택한 채팅방으로
          소켓 스트리밍을 테스트합니다.
        </p>
      </header>

      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">채팅방 생성 (POST /v1/chats)</h2>
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstChat">firstChat</Label>
            <TextArea
              id="firstChat"
              placeholder="예) AI 관련된 자료가 없어요?"
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
              disabled={!form.firstChat || creating}
            />
            {createError && <span className="text-red500 text-sm">에러: {createError}</span>}
            {!createError && !creating && form.firstChat === '' && (
              <span className="text-gray500 text-sm">firstChat 필수</span>
            )}
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
        {listError && <p className="text-red500 text-sm">에러: {listError}</p>}
        {listLoading && <p className="text-gray500 text-sm">불러오는 중...</p>}
        {!listLoading && chats.length === 0 && (
          <p className="text-gray600 text-sm">
            채팅방이 없습니다. firstChat을 입력해 생성해 보세요.
          </p>
        )}
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
            <h2 className="text-lg font-semibold">선택한 채팅 스트리밍</h2>
            <p className="text-gray600 text-sm">
              {selectedChatId ? `채팅방 #${selectedChatId}` : '채팅방을 선택하세요.'}{' '}
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
              <Label htmlFor="question">질문 전송 (/app/send/{selectedChatId})</Label>
              <TextArea
                id="question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="AI에게 질문을 입력하세요"
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
              </div>
            </div>

            {streamError && <p className="text-red500 text-sm">에러: {streamError}</p>}

            <div className="border-gray200 flex min-h-[200px] flex-col gap-2 rounded-lg border p-3">
              {streamLog.map(item => (
                <div
                  key={item.id}
                  className={`text-sm ${item.role === 'ai' ? 'text-gray-900' : 'text-gray-600'}`}
                >
                  {item.text}
                </div>
              ))}
              {streamBuffer && (
                <div className="text-sm text-gray-900">
                  {streamBuffer}
                  <span className="ml-1 animate-pulse">▍</span>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
