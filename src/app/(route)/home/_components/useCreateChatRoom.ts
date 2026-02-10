import { createChat } from '@/apis/chatApi';
import { BackendApiError } from '@/lib/client/backendClient';
import type { ChatRoom } from '@/types/api/chatApi';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

const defaultForm = { firstChat: '' };

export function useCreateChatRoom() {
  const qc = useQueryClient();

  const [form, setForm] = useState(defaultForm);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setForm(defaultForm);
    setError(null);
  }, []);

  const submit = useCallback(
    async (data?: { firstChat: string }) => {
      const submitData = data || form;
      if (data) {
        setForm(submitData);
      }
      if (!submitData.firstChat.trim()) {
        setError('첫 채팅 메시지를 입력해주세요.');
        return;
      }

      setCreating(true);
      setError(null);

      try {
        const created: ChatRoom = await createChat(submitData);

        // 채팅방 목록 갱신
        qc.invalidateQueries({ queryKey: ['chats'] });

        resetForm();
        return created;
      } catch (err) {
        if (err instanceof BackendApiError) {
          switch (err.status) {
            case 401:
              setError('로그인이 필요합니다.');
              break;
            case 400:
              setError('요청 형식이 올바르지 않습니다.');
              break;
            default:
              setError(err.message || '서버와 통신하는 중 오류가 발생했습니다.');
          }
        } else {
          setError('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        setCreating(false);
      }
    },
    [form, qc, resetForm]
  );

  return {
    form,
    submit,
    resetForm,
    creating,
    error,
  };
}
