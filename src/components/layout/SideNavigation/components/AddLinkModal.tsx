'use client';

import Button from '@/components/basics/Button/Button';
import Label from '@/components/basics/Label/Label';
import Modal from '@/components/basics/Modal/Modal';
import Skeleton from '@/components/basics/Skeleton/Skeleton';
import Spinner from '@/components/basics/Spinner/Spinner';
import TextArea from '@/components/basics/TextArea/TextArea';
import { usePostLinkMetaScrape } from '@/hooks/usePostLinkMetaScrape';
import { usePostLinks } from '@/hooks/usePostLinks';
import { FetchError } from '@/hooks/util/server/safeFetch';
import { useModalStore } from '@/stores/modalStore';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import AddLinkUrlInput from './AddLinkUrlInput';

const addLinkSchema = z.object({
  url: z.string().url({ message: '유효하지 않은 링크 주소입니다. URL을 다시 확인해 주세요.' }),
  title: z.string().min(1, { message: '제목을 입력해 주세요.' }),
  memo: z.string().optional(),
});
type AddLinkForm = z.infer<typeof addLinkSchema>;

const AddLinkModal = () => {
  const { close } = useModalStore();
  const createLink = usePostLinks();
  const metaScrape = usePostLinkMetaScrape();
  const [metaData, setMetaData] = useState<{
    title: string;
    description: string;
    image: string;
    url: string;
  } | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaErrorMessage, setMetaErrorMessage] = useState<string | null>(null);
  const lastScrapedUrl = useRef<string | null>(null);
  const metaRequestId = useRef(0);

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
  const trimmedUrl = useMemo(() => urlValue?.trim() ?? '', [urlValue]);
  const isValidUrl = useMemo(() => z.string().url().safeParse(trimmedUrl).success, [trimmedUrl]);
  const shouldDisableDetails = !trimmedUrl || !isValidUrl || metaLoading;
  const previewImageUrl = metaData?.image?.trim()
    ? metaData.image
    : '/images/default_linkcard_image.png';

  useEffect(() => {
    if (!trimmedUrl) {
      metaRequestId.current += 1;
      if (metaScrape.status !== 'idle') {
        metaScrape.reset();
      }
      if (metaLoading) {
        setMetaLoading(false);
      }
      if (metaData !== null) {
        setMetaData(null);
      }
      if (metaErrorMessage) {
        setMetaErrorMessage(null);
      }
      if (!dirtyFields.title && getValues('title')) {
        setValue('title', '', { shouldValidate: true });
      }
      if (!dirtyFields.memo && getValues('memo')) {
        setValue('memo', '', { shouldValidate: true });
      }
      lastScrapedUrl.current = null;
      return;
    }

    if (!isValidUrl) {
      metaRequestId.current += 1;
      if (metaLoading) {
        setMetaLoading(false);
      }
      if (metaData !== null) {
        setMetaData(null);
      }
      if (metaErrorMessage) {
        setMetaErrorMessage(null);
      }
      if (!dirtyFields.title && getValues('title')) {
        setValue('title', '', { shouldValidate: true });
      }
      if (!dirtyFields.memo && getValues('memo')) {
        setValue('memo', '', { shouldValidate: true });
      }
      lastScrapedUrl.current = null;
      return;
    }

    if (trimmedUrl === lastScrapedUrl.current) return;

    if (metaData !== null) {
      setMetaData(null);
    }
    if (metaErrorMessage) {
      setMetaErrorMessage(null);
    }
    if (!dirtyFields.title && getValues('title')) {
      setValue('title', '', { shouldValidate: true });
    }
    if (!dirtyFields.memo && getValues('memo')) {
      setValue('memo', '', { shouldValidate: true });
    }
    if (!metaLoading) {
      setMetaLoading(true);
    }
    const timeoutId = setTimeout(() => {
      metaRequestId.current += 1;
      const requestId = metaRequestId.current;
      lastScrapedUrl.current = trimmedUrl;
      metaScrape
        .mutateAsync(trimmedUrl)
        .then(data => {
          if (requestId !== metaRequestId.current) return;
          setMetaData(data);
          setMetaLoading(false);
          if (!dirtyFields.title) {
            setValue('title', data.title ?? '', { shouldValidate: true });
          }
          if (!dirtyFields.memo) {
            setValue('memo', data.description ?? '', { shouldValidate: true });
          }
        })
        .catch(error => {
          if (requestId !== metaRequestId.current) return;
          if (process.env.NODE_ENV !== 'production') {
            console.error('[meta-scrape] failed', error);
          }
          if (error instanceof FetchError) {
            setMetaErrorMessage(
              `메타 정보를 가져오지 못했습니다. (status: ${error.status ?? 'unknown'})`
            );
          }
          setMetaLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    trimmedUrl,
    isValidUrl,
    metaScrape,
    metaData,
    metaLoading,
    metaErrorMessage,
    setValue,
    getValues,
    dirtyFields.title,
    dirtyFields.memo,
  ]);

  const onSubmit = async (data: AddLinkForm) => {
    try {
      await createLink.mutateAsync({
        url: data.url,
        title: data.title,
        memo: data.memo?.trim() ? data.memo : undefined,
        imageUrl: metaData?.image?.trim() ? metaData.image : undefined,
      });
      close();
    } catch {
      // handled by createLink error state
    }
  };

  return (
    <Modal type="ADD_LINK" className="m-10 min-w-150">
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
              {errors.title && <span className="text-red500 text-xs">{errors.title.message}</span>}
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
        {createLink.isError && (
          <span className="text-red500 text-xs">저장에 실패했습니다. 다시 시도해 주세요.</span>
        )}
      </form>
    </Modal>
  );
};

AddLinkModal.displayName = 'AddLinkModal';
export default AddLinkModal;
