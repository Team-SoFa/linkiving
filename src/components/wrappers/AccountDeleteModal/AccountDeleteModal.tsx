'use client';

import type { MemberDeleteReason } from '@/apis/authApi';
import SVGIcon from '@/components/Icons/SVGIcon';
import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { useModalStore } from '@/stores/modalStore';
import { useState } from 'react';

const DELETE_REASONS: ReadonlyArray<{ label: string; value: MemberDeleteReason }> = [
  { label: '저장할 만한 링크가 별로 없었어요.', value: 'NO_USEFUL_LINKS' },
  { label: '찾으려는 링크를 잘 못 찾았어요.', value: 'POOR_SEARCH' },
  { label: '저장한 링크를 다시 찾아볼 일이 없었어요.', value: 'NO_REVISIT' },
  { label: '다른 서비스를 쓰기로 했어요.', value: 'SWITCHED_SERVICE' },
  { label: '개인 정보가 유출될까봐 걱정돼요.', value: 'PRIVACY_CONCERN' },
  { label: '기타', value: 'OTHER' },
] as const;

const AccountDeleteModal = () => {
  const { close } = useModalStore();
  const [step, setStep] = useState<'notice' | 'reason'>('notice');
  const [reason, setReason] = useState<MemberDeleteReason | null>(null);
  const { mutate: deleteAccount, isPending, isError } = useDeleteAccount();

  const handleClose = () => {
    if (isPending) return;
    close();
  };

  return (
    <Modal
      type="ACCOUNT_DELETE"
      ariaLabel={step === 'notice' ? '회원 탈퇴 안내' : '탈퇴 사유 선택'}
      closeDisabled={isPending}
      className="max-h-[calc(100dvh-32px)] w-[600px] max-w-[calc(100vw-32px)] overflow-y-auto sm:min-w-[520px]"
    >
      <div className="flex flex-col p-6 pt-5">
        {step === 'notice' ? (
          <>
            <h2 className="font-title-md text-gray900">회원 탈퇴</h2>
            <div className="text-yellow600 mt-3 flex items-center gap-2">
              <SVGIcon icon="IC_Warning" size="lg" aria-hidden="true" />
              <p className="font-label-md">회원 탈퇴 전, 주의하세요!</p>
            </div>
            <p className="font-body-md text-gray900 mt-2">
              탈퇴 시, 저장한 링크, 메모, AI 채팅 내역과 같은 모든 정보가 삭제되며,
              <br className="hidden sm:block" />
              한번 삭제된 정보와 계정은 복구할 수 없습니다. 회원 탈퇴를 진행하시겠습니까?
            </p>
            <div className="mt-10 flex gap-2 max-sm:flex-col-reverse">
              <Button
                variant="secondary"
                label="취소하기"
                className="flex-1"
                onClick={handleClose}
              />
              <Button
                variant="primary"
                label="탈퇴하기"
                className="flex-1"
                onClick={() => setStep('reason')}
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="font-title-md text-gray900">탈퇴 사유 (선택)</h2>
            <p className="font-body-md text-gray900 mt-3">
              서비스를 아껴주신 고객님의 마음에 감사드리며, 충분한 만족을 드리지 못해 죄송합니다.
              <br />
              탈퇴 사유를 남겨 주시면 서비스 개선에 더욱 힘쓰겠습니다.
            </p>
            <fieldset className="mt-4 flex flex-col gap-3">
              <legend className="sr-only">탈퇴 사유</legend>
              {DELETE_REASONS.map(item => (
                <label
                  key={item.value}
                  className="font-body-md group text-gray900 flex h-[26px] cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="delete-reason"
                    value={item.value}
                    checked={reason === item.value}
                    onChange={() => setReason(item.value)}
                    className="peer sr-only"
                  />
                  <span className="border-gray100 peer-focus-visible:ring-blue300 peer-checked:border-blue500 after:bg-blue500 group-hover:border-blue500 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border bg-white transition-colors group-hover:bg-white peer-checked:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 after:hidden after:h-[10px] after:w-[10px] after:rounded-full peer-checked:after:block" />
                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>
            {isError && (
              <p role="alert" className="font-body-sm text-red500 mt-3">
                회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.
              </p>
            )}
            <div className="mt-8 flex gap-2 max-sm:flex-col-reverse">
              <Button
                variant="secondary"
                label="취소하기"
                className="flex-1"
                onClick={handleClose}
                disabled={isPending}
              />
              <Button
                variant="primary"
                label="탈퇴하기"
                className="flex-1"
                onClick={() => deleteAccount(reason ?? 'OTHER')}
                loading={isPending}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AccountDeleteModal;
