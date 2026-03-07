'use client';

import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import { useDeleteLink } from '@/hooks/useDeleteLink';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';

import Anchor from '../../Anchor/Anchor';

interface DeleteLinkItem {
  id: number;
  title: string;
  url: string;
}

interface DeleteLinkModalProps {
  links: DeleteLinkItem[];
  onSuccess?: () => void;
}

const DeleteLinkModal = ({ links, onSuccess }: DeleteLinkModalProps) => {
  const deleteLink = useDeleteLink();
  const { close } = useModalStore();

  const handleDelete = async () => {
    try {
      await Promise.all(links.map(link => deleteLink.mutateAsync(link.id)));
      showToast({
        message: `${links.length}개의 링크가 삭제되었습니다.`,
        variant: 'success',
        showIcon: true,
      });
      onSuccess?.();
      close();
    } catch {
      showToast({
        message: '링크 삭제에 실패했습니다. 다시 시도해 주세요.',
        variant: 'error',
        showIcon: true,
      });
    }
  };

  return (
    <Modal type="DELETE_LINK" className="m-10 w-full max-w-md rounded-[0.625rem]">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-title-sm">정말로 삭제하시겠습니까?</h2>
          <p className="text-gray600 font-body-md">한 번 삭제한 링크는 다시 되돌릴 수 없습니다.</p>
        </div>

        <ul className="custom-scrollbar flex max-h-60 flex-col gap-2 overflow-y-auto rounded-xl p-3">
          {links.map(link => (
            <li key={link.id} className="flex flex-col gap-0.5">
              <span className="truncate text-sm font-semibold">{link.title}</span>
              <Anchor
                href={getSafeUrl(link.url)}
                aria-label={`${link.title} 페이지 링크 열기`}
                iconVisible={false}
              >
                {link.url}
              </Anchor>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            label="취소"
            className="flex-1"
            onClick={close}
          />
          <Button
            label={deleteLink.isPending ? '삭제 중...' : '삭제'}
            className="flex-1"
            disabled={deleteLink.isPending}
            onClick={handleDelete}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteLinkModal;
