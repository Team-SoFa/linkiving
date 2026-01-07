import { type ChatSocket, createChatSocket } from '@/apis/chatSocket';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UseChatStreamOptions = {
  chatId: string | number;
  enabled?: boolean;
  onChunk?: (chunk: string) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  useSockJS?: boolean;
};

export const useChatStream = ({
  chatId,
  enabled = true,
  onChunk,
  onEnd,
  onError,
  onConnect,
  onDisconnect,
  useSockJS,
}: UseChatStreamOptions) => {
  const socketRef = useRef<ChatSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onChunkRef = useRef(onChunk);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onChunkRef.current = onChunk;
  }, [onChunk]);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

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
      onMessage: chunk => onChunkRef.current?.(chunk),
      onEnd: () => {
        onEndRef.current?.();
      },
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

  return { send, connected };
};
