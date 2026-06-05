import { fetchSocketAuthState, isSocketAuthFailure } from '@/lib/client/socketAuth';
import type { EntityId } from '@/types/id';
import {
  Client,
  type IFrame,
  type IMessage,
  type StompHeaders,
  type StompSubscription,
} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL;

if (!WS_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_WS_BASE_URL');
}

const withAuthorizationHeader = (authorization: string | null): StompHeaders =>
  authorization ? { Authorization: authorization } : {};

type Callback = () => void;

export type ChatSocketLink = {
  linkId: EntityId;
  title: string;
  url: string;
  imageUrl: string | null;
  summary: string | null;
};

export type ChatSocketMessage = {
  success: boolean;
  chatId: EntityId;
  messageId: EntityId | null;
  content: string;
  isEnd: boolean;
  step: string | string[] | null;
  links: ChatSocketLink[] | null;
};

export type ChatSocketOptions = {
  chatId: EntityId;
  useSockJS?: boolean;
  onMessage: (payload: ChatSocketMessage) => void;
  onError?: (err: unknown) => void;
  onConnect?: Callback;
  onDisconnect?: Callback;
};

const WS_CHAT_ENDPOINT = `${WS_BASE_URL}/ws/chat`;
const SUBSCRIBE_DEST = process.env.NEXT_PUBLIC_WS_SUBSCRIBE_DEST ?? '/user/queue/chat';
const SEND_DEST = process.env.NEXT_PUBLIC_WS_SEND_DEST ?? '/ws/chat/send';
const CANCEL_DEST = process.env.NEXT_PUBLIC_WS_CANCEL_DEST ?? '/ws/chat/cancel';
const envUseSockJs = process.env.NEXT_PUBLIC_WS_USE_SOCKJS;
// Match the working test page: default to SockJS over HTTPS unless explicitly disabled.
const DEFAULT_USE_SOCKJS = envUseSockJs === undefined ? true : envUseSockJs === 'true';
const WS_DEBUG = process.env.NEXT_PUBLIC_WS_DEBUG === 'true';

export type ChatSocket = {
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (message: string) => Promise<void>;
  cancel: () => Promise<void>;
};

const toSockJsUrl = (url: string) => {
  if (/^http/i.test(url)) return url;
  return url.replace(/^ws(s?):\/\//i, (_, secure) => `http${secure ?? ''}://`);
};

const toWebSocketUrl = (url: string) => {
  if (/^ws/i.test(url)) return url;
  return url.replace(/^http(s?):\/\//i, (_, secure) => `ws${secure ?? ''}://`);
};

const toEntityIdOrNull = (value: unknown): EntityId | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string' && value.trim().length > 0) return value;
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
      const linkId = toEntityIdOrNull(link.linkId) ?? toEntityIdOrNull(link.id);
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

  const chatId = toEntityIdOrNull(data.chatId);
  if (chatId === null) {
    throw new Error('Invalid socket payload: chatId is missing.');
  }

  const content = typeof data.content === 'string' ? data.content : '';
  const messageId = toEntityIdOrNull(data.messageId);
  const isEnd = typeof data.isEnd === 'boolean' ? data.isEnd : false;
  const step = toStepOrNull(data.step);
  const links = toLinksOrNull(data.links);

  return {
    success: parsed.success,
    chatId,
    messageId,
    content,
    isEnd,
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
  let currentAuthorization: string | null = null;
  let currentToken: string | null = null;
  let connectAttempt = 0;
  let disconnected = false;
  let reconnectPromise: Promise<void> | null = null;

  const socketEndpoint = useSockJS
    ? toSockJsUrl(WS_CHAT_ENDPOINT)
    : toWebSocketUrl(WS_CHAT_ENDPOINT);

  const deactivateClient = async () => {
    subscription?.unsubscribe();
    subscription = null;
    await client.deactivate();
  };

  const connectWithLatestAuth = async (attempt: number) => {
    const authState = await fetchSocketAuthState();

    if (disconnected || attempt !== connectAttempt) {
      logWsDebug('connect-aborted', { attempt, connectAttempt, disconnected });
      return;
    }

    if (authState.kind === 'fetch-error') {
      currentAuthorization = null;
      currentToken = null;
      logWsDebug('connect-auth-fetch-failed', authState.error);
      onError?.(authState.error);
      return;
    }

    if (authState.kind === 'missing') {
      const error = new Error('세션이 만료되어 소켓에 연결할 수 없습니다. 다시 로그인해 주세요.');
      currentAuthorization = null;
      currentToken = null;
      logWsDebug('connect-auth-missing');
      onError?.(error);
      return;
    }

    currentAuthorization = authState.authorization;
    currentToken = authState.token;
    client.activate();
  };

  const reconnectWithLatestAuth = async (reason: string) => {
    if (disconnected) return;
    if (reconnectPromise) return reconnectPromise;

    reconnectPromise = (async () => {
      logWsDebug('reconnect', { reason });
      connectAttempt += 1;
      currentAuthorization = null;
      currentToken = null;
      await deactivateClient();

      if (disconnected) return;

      const nextAttempt = ++connectAttempt;
      await connectWithLatestAuth(nextAttempt);
    })().finally(() => {
      reconnectPromise = null;
    });

    return reconnectPromise;
  };

  const ensureReadyToPublish = async () => {
    if (!client.connected) {
      const error = new Error('Cannot send: socket is not connected.');
      onError?.(error);
      throw error;
    }

    const authState = await fetchSocketAuthState();
    if (authState.kind === 'fetch-error') {
      onError?.(authState.error);
      throw authState.error;
    }

    if (authState.kind === 'missing') {
      disconnect();
      const error = new Error(
        '세션이 만료되어 소켓 연결을 유지할 수 없습니다. 다시 로그인해 주세요.'
      );
      onError?.(error);
      throw error;
    }

    currentAuthorization = authState.authorization;

    if (currentToken !== authState.token) {
      await reconnectWithLatestAuth('token-changed');
      const error = new Error(
        '인증 세션이 갱신되어 소켓을 다시 연결했습니다. 잠시 후 다시 시도해 주세요.'
      );
      onError?.(error);
      throw error;
    }
  };

  const client = new Client({
    webSocketFactory: () =>
      useSockJS ? new SockJS(socketEndpoint) : new WebSocket(socketEndpoint),
    connectHeaders: {},
    beforeConnect: stompClient => {
      stompClient.connectHeaders = withAuthorizationHeader(currentAuthorization);
    },
    reconnectDelay: 5000,
    onStompError: (frame: IFrame) => {
      const message = frame.body || frame.headers.message || 'Socket error';
      if (isSocketAuthFailure(message)) {
        onError?.(new Error('인증이 만료되어 소켓을 다시 연결합니다. 잠시 후 다시 시도해 주세요.'));
        void reconnectWithLatestAuth('stomp-auth-error');
        return;
      }

      onError?.(new Error(message));
    },
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
        if (String(payload.chatId) !== String(chatId)) {
          logWsDebug('skip-message-chat-mismatch', {
            expectedChatId: chatId,
            actualChatId: payload.chatId,
          });
          return;
        }
        logWsDebug('parsed-message', payload);
        onMessage(payload);
      } catch (err) {
        logWsDebug('parse-error', err);
        onError?.(err);
      }
    });
  };

  const connect = async () => {
    const attempt = ++connectAttempt;
    disconnected = false;
    await connectWithLatestAuth(attempt);
  };

  const disconnect = () => {
    connectAttempt += 1;
    disconnected = true;
    currentAuthorization = null;
    currentToken = null;
    logWsDebug('disconnect');
    void deactivateClient();
  };

  const send = async (message: string) => {
    await ensureReadyToPublish();
    const body = JSON.stringify({ chatId: String(chatId), message });
    logWsDebug('send', { destination: SEND_DEST, body });
    client.publish({
      destination: SEND_DEST,
      body,
      headers: withAuthorizationHeader(currentAuthorization),
    });
  };

  const cancel = async () => {
    await ensureReadyToPublish();
    const body = JSON.stringify({ chatId: String(chatId) });
    logWsDebug('cancel', { destination: CANCEL_DEST, body });
    client.publish({
      destination: CANCEL_DEST,
      body,
      headers: withAuthorizationHeader(currentAuthorization),
    });
  };

  return { connect, disconnect, send, cancel };
};
