'use client';

import { clientApiClient } from '@/lib/client/apiClient';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { getAccessToken } from '@/stores/tokenStore';
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

const authHeaderFromClientState = (): string | null => {
  const tokenEntry = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIES_KEYS.ACCESS_TOKEN}=`));
  const cookieToken = tokenEntry
    ? decodeURIComponent(tokenEntry.substring(`${COOKIES_KEYS.ACCESS_TOKEN}=`.length))
    : '';
  const token = cookieToken || getAccessToken() || '';

  return token ? `Bearer ${token}` : null;
};

const withAuthorizationHeader = (authorization: string | null): StompHeaders =>
  authorization ? { Authorization: authorization } : {};

type SocketAuthResponse = {
  success: boolean;
  data?: {
    authorization?: string;
  };
};

const fetchSocketAuthorization = async (): Promise<string | null> => {
  const clientAuthorization = authHeaderFromClientState();
  if (clientAuthorization) return clientAuthorization;

  try {
    const response = await clientApiClient<SocketAuthResponse>('/api/socket-auth', {
      cache: 'no-store',
    });

    if (!response.success) return null;
    return response.data?.authorization ?? null;
  } catch (error) {
    logWsDebug('auth-fetch-error', error);
    return null;
  }
};

export type SummaryStatusPayload = {
  linkId: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  summary?: string;
  errorMessage?: string;
  updatedAt?: string;
};

export type LinkSummaryStatus = 'idle' | 'generating' | 'ready' | 'failed';

export type SummaryStatusEvent = {
  linkId: number;
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

const parsePayload = (rawBody: string): SummaryStatusEvent => {
  const payload = JSON.parse(rawBody) as SummaryStatusPayload;
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid summary status event payload');
  }

  const linkId = Number(payload.linkId);
  if (!Number.isFinite(linkId)) {
    throw new Error('Invalid summary status event: missing linkId.');
  }

  if (!payload.status || typeof payload.status !== 'string') {
    throw new Error('Invalid summary status event: missing status.');
  }

  return {
    linkId,
    status: coerceSummaryStatus(payload.status as SummaryStatusPayload['status']),
    progress: typeof payload.progress === 'number' ? payload.progress : undefined,
    summary: typeof payload.summary === 'string' ? payload.summary : undefined,
    errorMessage: typeof payload.errorMessage === 'string' ? payload.errorMessage : undefined,
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
  let connectAttempt = 0;
  let disconnected = false;
  let subscription: StompSubscription | null = null;

  const socketEndpoint = useSockJS
    ? toSockJsUrl(WS_SUMMARY_ENDPOINT)
    : toWebSocketUrl(WS_SUMMARY_ENDPOINT);

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
      console.error('[summary-socket] stomp error', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
      });
      onError?.(frame);
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
      onDisconnect?.();
    },
  });

  client.onConnect = () => {
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

    currentAuthorization = await fetchSocketAuthorization();

    console.log('[summary-socket] connect attempt', attempt, {
      currentAuthorization: !!currentAuthorization,
    });

    if (disconnected || attempt !== connectAttempt) {
      logWsDebug('connect-aborted', { attempt, connectAttempt, disconnected });
      console.warn('[summary-socket] connect aborted', { attempt, connectAttempt, disconnected });
      return;
    }

    if (!currentAuthorization) {
      const error = new Error('Cannot connect: authentication token is unavailable.');
      logWsDebug('connect-auth-missing');
      console.error('[summary-socket] auth missing');
      onError?.(error);
      return;
    }

    client.activate();
  };

  const disconnect = () => {
    connectAttempt += 1;
    disconnected = true;
    currentAuthorization = null;
    console.log('[summary-socket] disconnected');
    subscription?.unsubscribe();
    subscription = null;
    client.deactivate();
    onDisconnect?.();
  };

  return { connect, disconnect };
};
