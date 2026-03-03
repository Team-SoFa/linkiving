import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import { useDeleteChat } from '@/hooks/server/Chats/useDeleteChat';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';

interface Props {
  chatId: number;
  title: string;
}

const DeleteChatModal = ({ chatId, title }: Props) => {
  const { close } = useModalStore();
  const { mutate, isPending } = useDeleteChat();

  const handleDelete = () => {
    mutate(chatId, {
      onSuccess: () => {
        showToast({
          id: `delete_chatroom${chatId}_success`,
          message: `"${title}" 채팅을 삭제했습니다.`,
          variant: 'success',
          duration: 2000,
        });
        close();
      },
      onError: error => {
        showToast({
          id: `delete_chatroom${chatId}_fail`,
          message: '삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
          variant: 'error',
          duration: 2000,
        });
      },
    });
  };

  return (
    <Modal type="DELETE_CHAT" className="m-10 max-w-130 min-w-100">
      <div className="m-4 flex flex-col gap-2">
        <span className="font-title-md">채팅 삭제</span>
        <span className="font-body-md">
          채팅 삭제 시, 채팅에서 나눈 프롬프트, 대답, 기록들 전체가 영구 삭제됩니다.
          <br />
          채팅을 삭제하시겠습니까?
        </span>
        <div className="mt-30 flex w-full gap-2">
          <Button variant="secondary" label="취소하기" className="flex-1" onClick={close} />
          <Button
            variant="primary"
            label="삭제하기"
            className="flex-1"
            onClick={handleDelete}
            disabled={isPending}
            loading={isPending}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteChatModal;
