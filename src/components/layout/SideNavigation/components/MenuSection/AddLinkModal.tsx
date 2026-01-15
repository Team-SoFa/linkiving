'use client';

import Button from '@/components/basics/Button/Button';
import Label from '@/components/basics/Label/Label';
import Modal from '@/components/basics/Modal/Modal';
import Skeleton from '@/components/basics/Skeleton/Skeleton';
import Spinner from '@/components/basics/Spinner/Spinner';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useLinkMetaScrape } from '@/hooks/useLinkMetaScrape';
import { usePostLinks } from '@/hooks/usePostLinks';
import { useLinkStore } from '@/stores/linkStore';
import { useModalStore } from '@/stores/modalStore';
import { hideToast, showToast } from '@/stores/toastStore';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import AddLinkUrlInput from './AddLinkUrlInput';

const addLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .url({ message: '유효하지 않은 링크 주소입니다. URL을 다시 확인해 주세요.' }),
  title: z.string().min(1, { message: '제목을 입력해 주세요.' }),
  memo: z.string().optional(),
});
type AddLinkForm = z.infer<typeof addLinkSchema>;

const AddLinkModal = () => {
  const { close } = useModalStore();
  const createLink = usePostLinks();
  const lastSubmitErrorRef = useRef<Error | null>(null);
  const lastSubmitPayloadRef = useRef<{
    url: string;
    title: string;
    memo?: string;
    imageUrl?: string;
  } | null>(null);
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const router = useRouter();
  const selectLink = useLinkStore(state => state.selectLink);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid, dirtyFields },
  } = useForm<AddLinkForm>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { url: '', title: '', memo: '' },
    mode: 'all',
  });
  const urlValue = useWatch({ control, name: 'url' });
  const titleValue = useWatch({ control, name: 'title' });
  const memoValue = useWatch({ control, name: 'memo' });
  const trimmedUrl = useMemo(() => urlValue?.trim() ?? '', [urlValue]);
  const isValidUrl = useMemo(() => z.string().url().safeParse(trimmedUrl).success, [trimmedUrl]);
  const lastInputsRef = useRef({ trimmedUrl, titleValue, memoValue });
  const { metaData, metaLoading, metaErrorMessage } = useLinkMetaScrape<AddLinkForm>({
    url: trimmedUrl,
    isValidUrl,
    dirtyFields,
    getValues,
    setValue,
  });
  const shouldDisableDetails = !trimmedUrl || !isValidUrl || metaLoading;
  const previewImageUrl = metaData?.image?.trim()
    ? metaData.image
    : '/images/default_linkcard_image.png';

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

  const handleRetry = useCallback(
    async (toastId: string) => {
      const payload = lastSubmitPayloadRef.current;
      if (!payload) return;
      hideToast(toastId);
      lastSubmitErrorRef.current = null;
      try {
        const createdLink = await createLink.mutateAsync(payload);
        handleCreateSuccess(createdLink);
      } catch {
        // handled by createLink error state
      }
    },
    [createLink, handleCreateSuccess]
  );

  useEffect(() => {
    const lastInputs = lastInputsRef.current;
    const inputsChanged =
      lastInputs.trimmedUrl !== trimmedUrl ||
      lastInputs.titleValue !== titleValue ||
      lastInputs.memoValue !== memoValue;
    if (!inputsChanged) return;
    lastInputsRef.current = { trimmedUrl, titleValue, memoValue };
    setHasSubmitError(false);
    if (createLink.isError) {
      createLink.reset();
      lastSubmitErrorRef.current = null;
    }
  }, [trimmedUrl, titleValue, memoValue, createLink]);

  useEffect(() => {
    if (!createLink.isError || !createLink.error) return;
    if (lastSubmitErrorRef.current === createLink.error) return;
    lastSubmitErrorRef.current = createLink.error;
    setHasSubmitError(true);
    const toastId = showToast({
      message: '링크를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      variant: 'error',
      showIcon: true,
      placement: 'modal-bottom',
      actionLabel: '다시 시도',
      actionLabelIcon: 'IC_Regenerate',
      onAction: () => {
        handleRetry(toastId);
      },
    });
  }, [createLink.isError, createLink.error, handleRetry]);

  const onSubmit = async (data: AddLinkForm) => {
    const trimmedMemo = data.memo?.trim();
    const trimmedImageUrl = metaData?.image?.trim();

    lastSubmitPayloadRef.current = {
      url: data.url,
      title: data.title,
      memo: trimmedMemo || undefined,
      imageUrl: trimmedImageUrl || undefined,
    };
    try {
      const createdLink = await createLink.mutateAsync(lastSubmitPayloadRef.current);
      handleCreateSuccess(createdLink);
    } catch {
      // handled by createLink error state
    }
  };

  return (
    <Modal
      type="ADD_LINK"
      className={clsx(
        'm-10 min-w-150 rounded-[0.625rem] border',
        hasSubmitError ? 'border-red500' : 'border-transparent'
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="url-input">링크 주소</Label>
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
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col">
              <Label>썸네일</Label>
              <div
                className={`relative h-[4.2rem] w-full rounded-lg bg-white ${
                  shouldDisableDetails ? 'opacity-60' : ''
                }`}
                aria-disabled={shouldDisableDetails}
              >
                {metaLoading && isValidUrl ? (
                  <>
                    <Skeleton className="h-full w-full" radius="lg" animated />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner size="lg" />
                    </div>
                  </>
                ) : (
                  <Image src={previewImageUrl} alt="link thumbnail" fill />
                )}
              </div>
            </div>
            <div className="flex flex-3 flex-col">
              <Label htmlFor="title-input">제목</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="제목을 입력해 주세요."
                    id="title-input"
                    radius="lg"
                    heightLines={2}
                    maxHeightLines={2}
                    maxLength={100}
                    isLoading={metaLoading && isValidUrl}
                    disabled={shouldDisableDetails}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e)}
                  />
                )}
              />
              {errors.title && !shouldDisableDetails && (
                <span className="text-red500 text-xs">{errors.title.message}</span>
              )}
            </div>
          </div>
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
                maxLength={600}
                isLoading={metaLoading && isValidUrl}
                disabled={shouldDisableDetails}
                value={field.value ?? ''}
                onChange={e => field.onChange(e)}
              />
            )}
          />
        </div>
        <Button
          type="submit"
          label={createLink.isPending ? '저장 중...' : '저장하기'}
          disabled={!isValid || metaLoading || createLink.isPending}
        />
      </form>
    </Modal>
  );
};

AddLinkModal.displayName = 'AddLinkModal';
export default AddLinkModal;
