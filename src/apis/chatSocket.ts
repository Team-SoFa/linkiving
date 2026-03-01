import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL;

if (!WS_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_WS_BASE_URL');
}

const authHeaderValue = () => {
  const tokenEntry = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
  const token = tokenEntry
    ? decodeURIComponent(tokenEntry.substring('accessToken='.length))
    : undefined;
  return `Bearer ${token ?? ''}`;
};

type Callback = () => void;

export type ChatSocketLink = {
  linkId: number;
  title: string;
  url: string;
  imageUrl: string | null;
  summary: string | null;
};

export type ChatSocketMessage = {
  success: boolean;
  chatId: number;
  messageId: number | null;
  content: string;
  step: string | string[] | null;
  links: ChatSocketLink[] | null;
};

export type ChatSocketOptions = {
  chatId: string | number;
  useSockJS?: boolean;
  onMessage: (payload: ChatSocketMessage) => void;
  onError?: (err: unknown) => void;
  onConnect?: Callback;
  onDisconnect?: Callback;
};

const WS_CHAT_ENDPOINT = `${WS_BASE_URL}/ws/chat`;
const SUBSCRIBE_DEST = process.env.NEXT_PUBLIC_WS_SUBSCRIBE_DEST ?? '/user/queue/chat';
const SEND_DEST = process.env.NEXT_PUBLIC_WS_SEND_DEST ?? '/send';
const CANCEL_DEST = process.env.NEXT_PUBLIC_WS_CANCEL_DEST ?? '/cancel';
const envUseSockJs = process.env.NEXT_PUBLIC_WS_USE_SOCKJS;
// Match the working test page: default to SockJS over HTTPS unless explicitly disabled.
const DEFAULT_USE_SOCKJS = envUseSockJs === undefined ? true : envUseSockJs === 'true';
const WS_DEBUG = process.env.NEXT_PUBLIC_WS_DEBUG === 'true';

export type ChatSocket = {
  connect: () => void;
  disconnect: () => void;
  send: (message: string) => void;
  cancel: () => void;
};

const toSockJsUrl = (url: string) => {
  if (/^http/i.test(url)) return url;
  return url.replace(/^ws(s?):\/\//i, (_, secure) => `http${secure ?? ''}://`);
};

const toWebSocketUrl = (url: string) => {
  if (/^ws/i.test(url)) return url;
  return url.replace(/^http(s?):\/\//i, (_, secure) => `ws${secure ?? ''}://`);
};

const toNumberOrNull = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toStepOrNull = (value: unknown): string | string[] | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) return value;
  return null;
};

const toLinksOrNull = (value: unknown): ChatSocketLink[] | null => {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) return null;

  return value
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const link = item as Record<string, unknown>;
      const linkId = toNumberOrNull(link.linkId) ?? toNumberOrNull(link.id);
      const title = typeof link.title === 'string' ? link.title : '';
      const url = typeof link.url === 'string' ? link.url : '';
      if (linkId === null || !title || !url) return null;
      return {
        linkId,
        title,
        url,
        imageUrl: typeof link.imageUrl === 'string' ? link.imageUrl : null,
        summary: typeof link.summary === 'string' ? link.summary : null,
      };
    })
    .filter((link): link is ChatSocketLink => link !== null);
};

const parseIncomingMessage = (rawBody: string): ChatSocketMessage => {
  const parsed = JSON.parse(rawBody) as Record<string, unknown>;
  const data =
    parsed.data && typeof parsed.data === 'object'
      ? (parsed.data as Record<string, unknown>)
      : parsed;

  if (typeof parsed.success !== 'boolean') {
    throw new Error('Invalid socket payload: success is missing.');
  }

  const chatId = toNumberOrNull(data.chatId);
  if (chatId === null) {
    throw new Error('Invalid socket payload: chatId is missing.');
  }

  const content = typeof data.content === 'string' ? data.content : '';
  const messageId = toNumberOrNull(data.messageId);
  const step = toStepOrNull(data.step);
  const links = toLinksOrNull(data.links);

  return {
    success: parsed.success,
    chatId,
    messageId,
    content,
    step,
    links,
  };
};

const logWsDebug = (...args: unknown[]) => {
  if (!WS_DEBUG) return;
  console.debug('[chat-socket]', ...args);
};

export const createChatSocket = (options: ChatSocketOptions): ChatSocket => {
  const {
    chatId,
    useSockJS = DEFAULT_USE_SOCKJS,
    onMessage,
    onError,
    onConnect,
    onDisconnect,
  } = options;
  let subscription: StompSubscription | null = null;

  const socketEndpoint = useSockJS
    ? toSockJsUrl(WS_CHAT_ENDPOINT)
    : toWebSocketUrl(WS_CHAT_ENDPOINT);

  const client = new Client({
    webSocketFactory: () =>
      useSockJS ? new SockJS(socketEndpoint) : new WebSocket(socketEndpoint),
    connectHeaders: {},
    beforeConnect: stompClient => {
      // 소켓 연결 시도마다 최신 토큰 사용하도록 함
      stompClient.connectHeaders = { Authorization: authHeaderValue() };
    },
    reconnectDelay: 5000,
    onStompError: (frame: IFrame) => onError?.(frame),
    onWebSocketError: err => onError?.(err),
    onWebSocketClose: () => onDisconnect?.(),
  });

  client.onConnect = () => {
    logWsDebug('connected', { subscribe: SUBSCRIBE_DEST, chatId });
    onConnect?.();
    subscription = client.subscribe(SUBSCRIBE_DEST, (message: IMessage) => {
      try {
        logWsDebug('raw-message', message.body);
        const payload = parseIncomingMessage(message.body);
        logWsDebug('parsed-message', payload);
        onMessage(payload);
      } catch (err) {
        logWsDebug('parse-error', err);
        onError?.(err);
      }
    });
  };

  const connect = () => client.activate();

  const disconnect = () => {
    logWsDebug('disconnect');
    subscription?.unsubscribe();
    subscription = null;
    client.deactivate();
  };

  const send = (message: string) => {
    if (!client.connected) {
      const error = new Error('Cannot send: socket is not connected.');
      onError?.(error);
      throw error;
    }
    const body = JSON.stringify({ chatId: Number(chatId), message });
    logWsDebug('send', { destination: SEND_DEST, body });
    client.publish({
      destination: SEND_DEST,
      body,
      headers: { Authorization: authHeaderValue() },
    });
  };

  const cancel = () => {
    if (!client.connected) {
      const error = new Error('Cannot cancel: socket is not connected.');
      onError?.(error);
      throw error;
    }
    const body = JSON.stringify({ chatId: Number(chatId) });
    logWsDebug('cancel', { destination: CANCEL_DEST, body });
    client.publish({
      destination: CANCEL_DEST,
      body,
      headers: { Authorization: authHeaderValue() },
    });
  };

  return { connect, disconnect, send, cancel };
};
