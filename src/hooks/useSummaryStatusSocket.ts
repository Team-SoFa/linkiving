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
  useSockJS = true,
}: UseSummaryStatusSocketOptions) => {
  const socketRef = useRef<ReturnType<typeof createSummarySocket> | null>(null);

  useEffect(() => {
    if (!enabled) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = createSummarySocket({
      useSockJS,
      onEvent,
      onError,
      onConnect,
      onDisconnect,
    });

    socketRef.current = socket;
    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, onEvent, onError, onConnect, onDisconnect, useSockJS]);
};
