import { fetchChats } from '@/apis/chatApi';
import type { ChatRoom } from '@/types/api/chatApi';
import { useQuery } from '@tanstack/react-query';

export function useFetchChats() {
  return useQuery<ChatRoom[], Error>({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// const { data: chats, isLoading, error } = useFetchChat();
