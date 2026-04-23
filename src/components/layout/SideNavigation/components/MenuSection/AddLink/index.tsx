'use client';

import { updateLink } from '@/apis/linkApi';
import Button from '@/components/basics/Button/Button';
import Label from '@/components/basics/Label/Label';
import Modal from '@/components/basics/Modal/Modal';
import TextArea from '@/components/basics/TextArea/TextArea';
import { usePostLinks } from '@/hooks/usePostLinks';
import { MAX_MEMO_LENGTH } from '@/lib/constants/link';
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import { hideToast, showToast } from '@/stores/toastStore';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import AddLinkUrlInput from './AddLinkUrlInput';
import AddMultiLinks from './AddMultiLinks';
import DuplicateBanner from './DuplicateBanner';
import LinkThumbnailTitleSection from './LinkThumbnailTitleSection';
import { useAddLinkForm } from './hooks/useAddLinkForm';
import { useCreateLinkError } from './hooks/useCreateLinkError';
import { useDuplicateCheck } from './hooks/useDuplicateCheck';

const AddLinkModal = () => {
  const { close } = useModalStore();
  const createLink = usePostLinks();
  const router = useRouter();
  const selectLink = useLinkStore(state => state.selectLink);
  const qc = useQueryClient();

  const [isUpdatingDuplicate, setIsUpdatingDuplicate] = useState(false);
  const isSubmitting = createLink.isPending || isUpdatingDuplicate;
  const [isMultiMode, setIsMultiMode] = useState(false);

  const {
    form,
    trimmedUrl,
    isValidUrl,
    titleValue,
    memoValue,
    metaData,
    metaLoading,
    metaErrorMessage,
    shouldDisableDetails,
    previewImageUrl,
  } = useAddLinkForm();

  const { isDuplicate, duplicateLinkId, duplicateLinkData } = useDuplicateCheck(
    trimmedUrl,
    isValidUrl
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // 중복 감지 시 기존 링크 정보로 title/memo 채우기
  useEffect(() => {
    if (!isDuplicate || !duplicateLinkData || metaLoading) return;
    const { title, memo } = form.formState.dirtyFields;
    if (title || memo) return;
    form.setValue('title', duplicateLinkData.title, {
      shouldValidate: true,
      shouldDirty: false,
    });
    form.setValue('memo', duplicateLinkData.memo ?? '', {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [isDuplicate, duplicateLinkData, metaLoading, form]);

  const handleCreateSuccess = useCallback(
    (createdLink: { id: number }) => {
      const toastId = showToast({
        message: '링크가 저장되었습니다. 요약 생성을 시작합니다.',
        variant: 'success',
        showIcon: true,
        placement: 'modal-bottom',
        actionLabel: '요약 확인',
        actionLabelIcon: 'IC_AllLink',
        onAction: () => {
          hideToast(toastId);
          selectLink(createdLink.id);
          router.push('/all-link');
        },
      });
      close();
    },
    [close, router, selectLink]
  );

  const { hasSubmitError, lastSubmitPayloadRef } = useCreateLinkError({
    createLink,
    trimmedUrl,
    titleValue,
    memoValue,
    onRetry: async payload => {
      const createdLink = await createLink.mutateAsync(payload);
      handleCreateSuccess(createdLink);
    },
  });

  // 링크 저장 제출
  const onSubmit = async (data: import('./hooks/useAddLinkForm').AddLinkForm) => {
    if (isDuplicate && duplicateLinkId) {
      try {
        setIsUpdatingDuplicate(true);
        await updateLink(duplicateLinkId, {
          title: data.title,
          memo: data.memo?.trim() || undefined,
          imageUrl: metaData?.image?.trim() || undefined,
        });
        await qc.invalidateQueries({ queryKey: ['links'], exact: false });
        close();
      } catch {
        showToast({
          message: '링크 덮어쓰기에 실패했습니다. 다시 시도해 주세요.',
          variant: 'error',
          showIcon: true,
          placement: 'modal-bottom',
        });
      } finally {
        setIsUpdatingDuplicate(false);
      }
      return;
    }

    try {
      lastSubmitPayloadRef.current = {
        url: data.url,
        title: data.title,
        memo: data.memo?.trim() || undefined,
        imageUrl: metaData?.image?.trim() || undefined,
      };
      const createdLink = await createLink.mutateAsync(lastSubmitPayloadRef.current);
      handleCreateSuccess(createdLink);
    } catch {
      // 에러는 useCreateLinkError에서 처리
    }
  };

  return (
    <Modal
      type="ADD_LINK"
      className={clsx(
        'custom-scrollbar m-10 max-h-130 min-w-50 overflow-y-scroll rounded-[0.625rem] border md:min-w-150',
        hasSubmitError ? 'border-red500' : 'border-transparent'
      )}
    >
      {isMultiMode ? (
        <AddMultiLinks onToggle={() => setIsMultiMode(false)} />
      ) : (
        <>
          {isDuplicate && <DuplicateBanner />}
          <form onSubmit={handleSubmit(onSubmit)} className="m-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="url-input">{isDuplicate ? '기존 링크 정보' : '링크 주소'}</Label>
                {!isDuplicate && (
                  <Button
                    variant="secondary"
                    size="sm"
                    label="여러개 추가하기"
                    onClick={() => setIsMultiMode(true)}
                  />
                )}
              </div>
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <AddLinkUrlInput
                    {...field}
                    id="url-input"
                    placeholder="URL을 입력해 주세요."
                    onChange={field.onChange}
                    errorMessage={errors.url?.message}
                  />
                )}
              />
              {metaErrorMessage && <span className="text-red500 text-xs">{metaErrorMessage}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <LinkThumbnailTitleSection
                control={control}
                errors={errors}
                metaLoading={metaLoading}
                isValidUrl={isValidUrl}
                shouldDisableDetails={shouldDisableDetails}
                previewImageUrl={previewImageUrl}
              />
            </div>
            <div className="flex w-full flex-col">
              <Label htmlFor="memo-input">메모</Label>
              <Controller
                name="memo"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    id="memo-input"
                    placeholder="메모를 입력해 주세요."
                    radius="lg"
                    heightLines={3}
                    maxHeightLines={3}
                    maxLength={MAX_MEMO_LENGTH}
                    showMax
                    isLoading={metaLoading && isValidUrl}
                    disabled={shouldDisableDetails}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e)}
                  />
                )}
              />
            </div>
            <div className="flex gap-2">
              {isDuplicate && duplicateLinkId && (
                <Button
                  type="button"
                  variant="secondary"
                  label="기존 링크 유지하기"
                  className="flex-1"
                  onClick={close}
                />
              )}
              <Button
                type="submit"
                label={isSubmitting ? '저장 중...' : isDuplicate ? '새로 덮어쓰기' : '저장하기'}
                disabled={!isValid || metaLoading || isSubmitting}
                className="flex-1"
              />
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

AddLinkModal.displayName = 'AddLinkModal';
export default AddLinkModal;
