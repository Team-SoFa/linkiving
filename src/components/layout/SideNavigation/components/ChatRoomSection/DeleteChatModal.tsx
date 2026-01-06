import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import { useModalStore } from '@/stores/modalStore';

// import { useDeleteChat } from './hooks/useDeleteChat';

const DeleteChatModal = ({ chatId }: { chatId: number }) => {
  const { close } = useModalStore();
  // const deleteChatMutation = useDeleteChat();

  const handleDelete = () => {
    // deleteChatMutation.mutate(chatId, {
    // onSuccess: () => close(),
    // onError: (error) => {
    // TODO: 에러 처리
    // },
    // });
    close();
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
          <Button variant="primary" label="삭제하기" className="flex-1" onClick={handleDelete} />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteChatModal;
