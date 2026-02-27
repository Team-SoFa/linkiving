import { fetchChats } from '@/apis/chatApi';
import { useQuery } from '@tanstack/react-query';

export const useChatList = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 1000 * 60, // 1분
    retry: 2,
  });
};
