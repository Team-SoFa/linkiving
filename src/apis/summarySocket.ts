'use client';

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

const WS_SUMMARY_ENDPOINT = `${WS_BASE_URL}/ws/link`;
const SUBSCRIBE_DEST = process.env.NEXT_PUBLIC_WS_SUMMARY_SUBSCRIBE_DEST ?? '/user/queue/summary';
const envUseSockJs = process.env.NEXT_PUBLIC_WS_USE_SOCKJS;
const DEFAULT_USE_SOCKJS = envUseSockJs === undefined ? true : envUseSockJs === 'true';
const WS_DEBUG = process.env.NEXT_PUBLIC_WS_DEBUG === 'true';

const withAuthorizationHeader = (authorization: string | null): StompHeaders =>
  authorization ? { Authorization: authorization } : {};

export type SummaryStatusPayload = {
  linkId: EntityId;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  summary?: { id?: EntityId; content?: string } | string | null;
  errorMessage?: string;
  updatedAt?: string;
  data?: { id?: EntityId; content?: string } | string | null;
};

export type LinkSummaryStatus = 'idle' | 'generating' | 'ready' | 'failed';

export type SummaryStatusEvent = {
  linkId: EntityId;
  status: LinkSummaryStatus;
  progress?: number;
  summary?: string;
  errorMessage?: string;
  updatedAt?: string;
};

type Callback = () => void;

export type SummarySocketOptions = {
  useSockJS?: boolean;
  onEvent: (event: SummaryStatusEvent) => void;
  onError?: (err: unknown) => void;
  onConnect?: Callback;
  onDisconnect?: Callback;
};

const toSockJsUrl = (url: string) => {
  if (/^http/i.test(url)) return url;
  return url.replace(/^ws(s?):\/\//i, (_, secure) => `http${secure ?? ''}://`);
};

const toWebSocketUrl = (url: string) => {
  if (/^ws/i.test(url)) return url;
  return url.replace(/^http(s?):\/\//i, (_, secure) => `ws${secure ?? ''}://`);
};

const SUMMARY_STATUS_MAP: Record<SummaryStatusPayload['status'], LinkSummaryStatus> = {
  PENDING: 'generating',
  PROCESSING: 'generating',
  COMPLETED: 'ready',
  FAILED: 'failed',
};

const coerceSummaryStatus = (status: SummaryStatusPayload['status']): LinkSummaryStatus => {
  if (status in SUMMARY_STATUS_MAP) {
    return SUMMARY_STATUS_MAP[status];
  }

  throw new Error(`Invalid summary status event: unsupported status "${String(status)}".`);
};

const resolveSummaryText = (
  rawSummary: SummaryStatusPayload['summary'] | SummaryStatusPayload['data']
): string | undefined => {
  if (rawSummary !== null && typeof rawSummary === 'object') {
    return typeof rawSummary.content === 'string' ? rawSummary.content : undefined;
  }

  return typeof rawSummary === 'string' ? rawSummary : undefined;
};

const toEntityIdOrNull = (value: unknown): EntityId | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return null;
};

const parsePayload = (rawBody: string): SummaryStatusEvent => {
  const payload = JSON.parse(rawBody) as SummaryStatusPayload;
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid summary status event payload');
  }

  const linkId = toEntityIdOrNull(payload.linkId);
  if (linkId === null) {
    throw new Error('Invalid summary status event: missing linkId.');
  }

  if (!payload.status || typeof payload.status !== 'string') {
    throw new Error('Invalid summary status event: missing status.');
  }

  return {
    linkId,
    status: coerceSummaryStatus(payload.status as SummaryStatusPayload['status']),
    progress: typeof payload.progress === 'number' ? payload.progress : undefined,
    summary: resolveSummaryText(payload.summary ?? payload.data),
    errorMessage:
      typeof payload.errorMessage === 'string'
        ? payload.errorMessage
        : payload.status === 'FAILED' && typeof payload.data === 'string'
          ? payload.data
          : undefined,
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : undefined,
  };
};

const logWsDebug = (...args: unknown[]) => {
  if (!WS_DEBUG) return;
  console.debug('[summary-socket]', ...args);
};

export type SummarySocket = {
  connect: () => Promise<void>;
  disconnect: () => void;
};

export const createSummarySocket = ({
  useSockJS = DEFAULT_USE_SOCKJS,
  onEvent,
  onError,
  onConnect,
  onDisconnect,
}: SummarySocketOptions): SummarySocket => {
  let currentAuthorization: string | null = null;
  let currentToken: string | null = null;
  let connectAttempt = 0;
  let disconnected = false;
  let hasNotifiedDisconnect = false;
  let subscription: StompSubscription | null = null;
  let reconnectPromise: Promise<void> | null = null;

  const socketEndpoint = useSockJS
    ? toSockJsUrl(WS_SUMMARY_ENDPOINT)
    : toWebSocketUrl(WS_SUMMARY_ENDPOINT);

  const notifyDisconnect = () => {
    if (hasNotifiedDisconnect) return;
    hasNotifiedDisconnect = true;
    onDisconnect?.();
  };

  const deactivateClient = async () => {
    subscription?.unsubscribe();
    subscription = null;
    await client.deactivate();
  };

  const connectWithLatestAuth = async (attempt: number) => {
    const authState = await fetchSocketAuthState();

    if (disconnected || attempt !== connectAttempt) {
      logWsDebug('connect-aborted', { attempt, connectAttempt, disconnected });
      console.warn('[summary-socket] connect aborted', { attempt, connectAttempt, disconnected });
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
      currentAuthorization = null;
      currentToken = null;
      const error = new Error(
        '세션이 만료되어 요약 소켓에 연결할 수 없습니다. 다시 로그인해 주세요.'
      );
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

  const client = new Client({
    webSocketFactory: () => {
      console.log('[summary-socket] creating socket to', socketEndpoint);
      return useSockJS ? new SockJS(socketEndpoint) : new WebSocket(socketEndpoint);
    },
    connectHeaders: {},
    beforeConnect: stompClient => {
      stompClient.connectHeaders = withAuthorizationHeader(currentAuthorization);
    },
    reconnectDelay: 5000,
    onStompError: (frame: IFrame) => {
      const message = frame.body || frame.headers.message || 'Socket error';
      if (isSocketAuthFailure(message)) {
        onError?.(
          new Error('요약 소켓 인증이 만료되어 다시 연결합니다. 잠시 후 상태를 다시 확인해 주세요.')
        );
        void reconnectWithLatestAuth('stomp-auth-error');
        return;
      }

      console.error('[summary-socket] stomp error', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
      });
      onError?.(new Error(message));
    },
    onWebSocketError: err => {
      console.error('[summary-socket] websocket error', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        error: err,
      });
      onError?.(err);
    },
    onWebSocketClose: () => {
      console.warn('[summary-socket] websocket closed');
      notifyDisconnect();
      if (disconnected) return;
      void reconnectWithLatestAuth('websocket-close');
    },
  });

  client.onConnect = () => {
    hasNotifiedDisconnect = false;
    console.log('[summary-socket] connected to', SUBSCRIBE_DEST);
    logWsDebug('connected', { subscribe: SUBSCRIBE_DEST });
    onConnect?.();
    subscription = client.subscribe(SUBSCRIBE_DEST, (message: IMessage) => {
      try {
        console.log('[summary-socket] raw message', message.body);
        logWsDebug('raw-message', message.body);
        const event = parsePayload(message.body);
        console.log('[summary-socket] parsed event', event);
        logWsDebug('parsed-event', event);
        onEvent(event);
      } catch (error) {
        console.error('[summary-socket] parse error', error);
        logWsDebug('parse-error', error);
        onError?.(error);
      }
    });
  };

  const connect = async () => {
    const attempt = ++connectAttempt;
    disconnected = false;
    hasNotifiedDisconnect = false;

    console.log('[summary-socket] connect attempt', attempt, {
      useSockJS,
    });

    if (disconnected || attempt !== connectAttempt) {
      logWsDebug('connect-aborted', { attempt, connectAttempt, disconnected });
      console.warn('[summary-socket] connect aborted', { attempt, connectAttempt, disconnected });
      return;
    }

    await connectWithLatestAuth(attempt);
  };

  const disconnect = () => {
    connectAttempt += 1;
    disconnected = true;
    currentAuthorization = null;
    currentToken = null;
    console.log('[summary-socket] disconnected');
    void deactivateClient();
    notifyDisconnect();
  };

  return { connect, disconnect };
};
