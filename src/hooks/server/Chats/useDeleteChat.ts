import { deleteChat } from '@/apis/chatApi';
import type { DeleteChatApiResponse } from '@/types/api/chatApi';
import type { EntityId } from '@/types/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteChat() {
  const qc = useQueryClient();

  return useMutation<DeleteChatApiResponse, Error, EntityId>({
    mutationFn: id => deleteChat(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['chats'] });
      qc.removeQueries({ queryKey: ['chats', id] });
    },
  });
}
