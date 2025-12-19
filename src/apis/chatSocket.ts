import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs';
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

type Callback = () => void;

export type ChatSocketOptions = {
  chatId: string | number;
  useSockJS?: boolean;
  onMessage: (chunk: string) => void;
  onEnd?: Callback;
  onError?: (err: unknown) => void;
  onConnect?: Callback;
  onDisconnect?: Callback;
};

const WS_CHAT_ENDPOINT = `${WS_BASE_URL}/ws/chat`;
const SUBSCRIBE_DEST_BASE = process.env.NEXT_PUBLIC_WS_SUBSCRIBE_DEST ?? '/topic/chat';
const SEND_DEST_BASE = process.env.NEXT_PUBLIC_WS_SEND_DEST ?? '/ws/chat/send';
const envUseSockJs = process.env.NEXT_PUBLIC_WS_USE_SOCKJS;
// Match the working test page: default to SockJS over HTTPS unless explicitly disabled.
const DEFAULT_USE_SOCKJS = envUseSockJs === undefined ? true : envUseSockJs === 'true';

export type ChatSocket = {
  connect: () => void;
  disconnect: () => void;
  send: (message: string) => void;
};

const toSockJsUrl = (url: string) => {
  if (/^http/i.test(url)) return url;
  return url.replace(/^ws(s?):\/\//i, (_, secure) => `http${secure ?? ''}://`);
};

const toWebSocketUrl = (url: string) => {
  if (/^ws/i.test(url)) return url;
  return url.replace(/^http(s?):\/\//i, (_, secure) => `ws${secure ?? ''}://`);
};

export const createChatSocket = (options: ChatSocketOptions): ChatSocket => {
  const {
    chatId,
    useSockJS = DEFAULT_USE_SOCKJS,
    onMessage,
    onEnd,
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
    connectHeaders: { Authorization: authHeaderValue() },
    reconnectDelay: 5000,
    onStompError: (frame: IFrame) => onError?.(frame),
    onWebSocketError: err => onError?.(err),
    onWebSocketClose: () => onDisconnect?.(),
  });

  client.onConnect = () => {
    onConnect?.();
    subscription = client.subscribe(`${SUBSCRIBE_DEST_BASE}/${chatId}`, (message: IMessage) => {
      const payload = message.body;
      onMessage(payload);
      if (payload === 'END_OF_STREAM') {
        onEnd?.();
      }
    });
  };

  const connect = () => client.activate();

  const disconnect = () => {
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
    client.publish({
      destination: `${SEND_DEST_BASE}/${chatId}`,
      body: message,
      headers: { Authorization: authHeaderValue() },
    });
  };

  return { connect, disconnect, send };
};
