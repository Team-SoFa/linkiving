import { useChatStore } from '@/stores/chatStore';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

if (!WS_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_WS_BASE_URL');
}

if (!API_TOKEN) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_TOKEN');
}

const authHeaderValue = () => `Bearer ${API_TOKEN}`;

const WS_CHAT_ENDPOINT = `${WS_BASE_URL}/ws/chat`;
const SUBSCRIBE_DEST = process.env.NEXT_PUBLIC_WS_SUBSCRIBE_DEST ?? '/user/queue/chat';
const SEND_DEST = process.env.NEXT_PUBLIC_WS_SEND_DEST ?? '/send';
const CANCEL_DEST = process.env.NEXT_PUBLIC_WS_CANCEL_DEST ?? '/cancel';
const envUseSockJs = process.env.NEXT_PUBLIC_WS_USE_SOCKJS;
const DEFAULT_USE_SOCKJS = envUseSockJs === undefined ? true : envUseSockJs === 'true';

const toSockJsUrl = (url: string) => {
  if (/^http/i.test(url)) return url;
  return url.replace(/^ws(s?):\/\//i, (_, secure) => `http${secure ?? ''}://`);
};

const toWebSocketUrl = (url: string) => {
  if (/^ws/i.test(url)) return url;
  return url.replace(/^http(s?):\/\//i, (_, secure) => `ws${secure ?? ''}://`);
};

type IncomingMessage = {
  success: boolean;
  content: string;
  chatId: number | null;
};

const parseIncoming = (rawBody: string): IncomingMessage => {
  const parsed = JSON.parse(rawBody) as {
    success?: boolean;
    content?: string;
    chatId?: number;
    data?: {
      content?: string;
      chatId?: number;
    };
  };
  const data = parsed.data ?? parsed;

  return {
    success: parsed.success === true,
    content: typeof data.content === 'string' ? data.content : '',
    chatId: typeof data.chatId === 'number' ? data.chatId : null,
  };
};

export const useStompChat = () => {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const tokenRef = useRef<string>('');
  const { addMessage, updateLastAiMessage, setConnected, setGenerating, clearMessages } =
    useChatStore();

  useEffect(
    () => () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
      subscriptionRef.current = null;
    },
    []
  );

  const cleanupClient = () => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    clientRef.current?.deactivate();
    clientRef.current = null;
  };

  const connect = (token: string, chatId: string | number, useSockJS = DEFAULT_USE_SOCKJS) => {
    cleanupClient();
    tokenRef.current = token;

    const socketEndpoint = useSockJS
      ? toSockJsUrl(WS_CHAT_ENDPOINT)
      : toWebSocketUrl(WS_CHAT_ENDPOINT);

    const client = new Client({
      webSocketFactory: () =>
        useSockJS ? new SockJS(socketEndpoint) : new WebSocket(socketEndpoint),
      connectHeaders: { Authorization: token ? `Bearer ${token}` : authHeaderValue() },
      debug: () => {},
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      setConnected(true);
      clearMessages();
      addMessage({ id: `sys-${Date.now()}`, role: 'system', content: '소켓 연결 성공' });

      subscriptionRef.current = client.subscribe(SUBSCRIBE_DEST, message => {
        try {
          const payload = parseIncoming(message.body);
          if (payload.chatId !== null && String(payload.chatId) !== String(chatId)) return;

          if (payload.success) {
            updateLastAiMessage(payload.content);
          } else {
            addMessage({
              id: `err-${Date.now()}`,
              role: 'system',
              content: payload.content || '답변 생성에 실패했습니다.',
            });
          }
        } catch {
          addMessage({
            id: `err-${Date.now()}`,
            role: 'system',
            content: '소켓 응답 파싱에 실패했습니다.',
          });
        } finally {
          setGenerating(false);
        }
      });
    };

    client.onStompError = frame => {
      addMessage({
        id: `err-${Date.now()}`,
        role: 'system',
        content: `소켓 오류: ${frame.body ?? '알 수 없는 오류'}`,
      });
    };

    client.activate();
    clientRef.current = client;
  };

  const disconnect = () => {
    cleanupClient();
    setConnected(false);
    setGenerating(false);
  };

  const sendMessage = (chatId: string | number, content: string) => {
    if (!clientRef.current?.connected) return;

    addMessage({ id: `${Date.now()}`, role: 'user', content });
    addMessage({ id: `${Date.now() + 1}`, role: 'ai', content: '...' });
    setGenerating(true);

    clientRef.current.publish({
      destination: SEND_DEST,
      body: JSON.stringify({ chatId: Number(chatId), message: content }),
      headers: {
        Authorization: tokenRef.current ? `Bearer ${tokenRef.current}` : authHeaderValue(),
      },
    });
  };

  const cancelGeneration = (chatId: string | number) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: CANCEL_DEST,
      body: JSON.stringify({ chatId: Number(chatId) }),
      headers: {
        Authorization: tokenRef.current ? `Bearer ${tokenRef.current}` : authHeaderValue(),
      },
    });
  };

  return { connect, disconnect, sendMessage, cancelGeneration };
};
