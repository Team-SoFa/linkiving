import { createChat } from '@/apis/chatApi';
import { FetchError, ParseError, TimeoutError } from '@/hooks/util/api/error/errors';
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
        switch (true) {
          case err instanceof FetchError && err.status === 401:
            setError('로그인이 필요합니다.');
            break;
          case err instanceof FetchError && err.status === 400:
            setError('요청 형식이 올바르지 않습니다.');
            break;
          case err instanceof TimeoutError:
            setError('요청이 시간 초과되었습니다. 다시 시도해주세요.');
            break;
          case err instanceof ParseError:
            setError('서버 응답을 처리하는 중 오류가 발생했습니다.');
            break;
          case err instanceof FetchError:
            setError(err.message || '서버와 통신하는 중 오류가 발생했습니다.');
            break;
          default:
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
