'use client';

import { type SummaryStatusEvent, createSummarySocket } from '@/apis/summarySocket';
import { useEffect, useRef } from 'react';

export type UseSummaryStatusSocketOptions = {
  enabled?: boolean;
  onEvent: (event: SummaryStatusEvent) => void;
  onError?: (error: unknown) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  useSockJS?: boolean;
};

export const useSummaryStatusSocket = ({
  enabled = true,
  onEvent,
  onError,
  onConnect,
  onDisconnect,
  useSockJS,
}: UseSummaryStatusSocketOptions) => {
  const socketRef = useRef<ReturnType<typeof createSummarySocket> | null>(null);
  const onEventRef = useRef(onEvent);
  const onErrorRef = useRef(onError);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onEventRef.current = onEvent;
    onErrorRef.current = onError;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onEvent, onError, onConnect, onDisconnect]);

  useEffect(() => {
    if (!enabled) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = createSummarySocket({
      useSockJS,
      onEvent: event => onEventRef.current(event),
      onError: error => onErrorRef.current?.(error),
      onConnect: () => onConnectRef.current?.(),
      onDisconnect: () => onDisconnectRef.current?.(),
    });

    socketRef.current = socket;
    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, useSockJS]);
};
