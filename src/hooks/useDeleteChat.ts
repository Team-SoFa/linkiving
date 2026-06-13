import { deleteChat } from '@/apis/chatApi';
import type { EntityId } from '@/types/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteChat = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: EntityId) => deleteChat(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
