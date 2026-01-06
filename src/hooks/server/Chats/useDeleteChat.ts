import { deleteChat } from '@/apis/chatApi';
import type { DeleteChatApiResponse } from '@/types/api/chatApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteChat() {
  const qc = useQueryClient();

  return useMutation<DeleteChatApiResponse, Error, number>({
    mutationFn: id => deleteChat(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['chats'] });
      qc.removeQueries({ queryKey: ['chats', id] });
    },
  });
}
