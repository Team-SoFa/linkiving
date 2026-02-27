import { deleteChat } from '@/apis/chatApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteChat = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteChat(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
