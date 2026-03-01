import { type ChatSocket, type ChatSocketMessage, createChatSocket } from '@/apis/chatSocket';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UseChatStreamOptions = {
  chatId: string | number;
  enabled?: boolean;
  onMessage?: (payload: ChatSocketMessage) => void;
  onError?: (err: unknown) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  useSockJS?: boolean;
};

export const useChatStream = ({
  chatId,
  enabled = true,
  onMessage,
  onError,
  onConnect,
  onDisconnect,
  useSockJS,
}: UseChatStreamOptions) => {
  const socketRef = useRef<ChatSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onConnectRef.current = onConnect;
  }, [onConnect]);

  useEffect(() => {
    onDisconnectRef.current = onDisconnect;
  }, [onDisconnect]);

  useEffect(() => {
    if (!enabled) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = createChatSocket({
      chatId,
      useSockJS,
      onMessage: payload => onMessageRef.current?.(payload),
      onError: err => onErrorRef.current?.(err),
      onConnect: () => {
        setConnected(true);
        onConnectRef.current?.();
      },
      onDisconnect: () => {
        setConnected(false);
        onDisconnectRef.current?.();
      },
    });

    socketRef.current = socket;
    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [chatId, enabled, useSockJS]);

  const send = useCallback(
    (message: string) => {
      if (!enabled) return;
      socketRef.current?.send(message);
    },
    [enabled]
  );

  const cancel = useCallback(() => {
    if (!enabled) return;
    socketRef.current?.cancel();
  }, [enabled]);

  return { send, cancel, connected };
};
