import { useLinkMetaScrape } from '@/hooks/useLinkMetaScrape';
import { MAX_TITLE_LENGTH } from '@/lib/constants/link';
import { EMPTY_URL_MESSAGE, INVALID_URL_MESSAGE, normalizeUrlInput } from '@/lib/url/normalizeUrl';
import { showToast } from '@/stores/toastStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClipboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const addLinkSchema = z.object({
  url: z.string().transform((value, context) => {
    const result = normalizeUrlInput(value);
    if (!result.success) {
      context.addIssue({
        code: 'custom',
        message: result.reason === 'empty' ? EMPTY_URL_MESSAGE : INVALID_URL_MESSAGE,
      });
      return z.NEVER;
    }
    return result.url;
  }),
  title: z.string().trim().min(1, { message: '제목을 입력해 주세요.' }).max(MAX_TITLE_LENGTH),
  memo: z.string().optional(),
});

export type AddLinkForm = z.infer<typeof addLinkSchema>;

export function useAddLinkForm() {
  const form = useForm<AddLinkForm>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { url: '', title: '', memo: '' },
    mode: 'all',
  });

  const {
    control,
    clearErrors,
    setValue,
    setError,
    getValues,
    setFocus,
    formState: { dirtyFields },
  } = form;

  const urlValue = useWatch({ control, name: 'url' });
  const titleValue = useWatch({ control, name: 'title' });
  const memoValue = useWatch({ control, name: 'memo' });
  const [validatedUrl, setValidatedUrl] = useState('');
  const [hasEditedTitle, setHasEditedTitle] = useState(false);
  const hasEditedUrlRef = useRef(false);

  const handleUrlChange = useCallback(
    (value: string) => {
      hasEditedUrlRef.current = true;
      setValidatedUrl('');
      clearErrors('url');
      setValue('url', value, { shouldDirty: true, shouldValidate: false });
    },
    [clearErrors, setValue]
  );

  const commitUrl = useCallback(
    (value: string) => {
      const result = normalizeUrlInput(value);

      if (!result.success) {
        setValidatedUrl('');
        if (result.reason === 'empty' && !hasEditedUrlRef.current) {
          clearErrors('url');
          return;
        }
        setError('url', {
          type: 'manual',
          message: result.reason === 'empty' ? EMPTY_URL_MESSAGE : INVALID_URL_MESSAGE,
        });
        return;
      }

      setValue('url', result.url, { shouldDirty: true, shouldValidate: true });
      setValidatedUrl(result.url);
      clearErrors('url');
    },
    [clearErrors, setError, setValue]
  );

  const handleUrlBlur = useCallback(() => commitUrl(getValues('url')), [commitUrl, getValues]);

  const handleUrlPaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      const input = event.currentTarget;
      const value =
        input.value.slice(0, input.selectionStart) +
        event.clipboardData.getData('text/plain') +
        input.value.slice(input.selectionEnd);
      handleUrlChange(value);
      commitUrl(value);
    },
    [commitUrl, handleUrlChange]
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      setHasEditedTitle(true);
      clearErrors('title');
      setValue('title', value.slice(0, MAX_TITLE_LENGTH), {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
    [clearErrors, setValue]
  );

  const trimmedUrl = useMemo(() => validatedUrl.trim(), [validatedUrl]);
  const isValidUrl = Boolean(validatedUrl);

  const { metaData, metaLoading, metaErrorMessage, metaErrorUrl } = useLinkMetaScrape<AddLinkForm>({
    url: trimmedUrl,
    isValidUrl,
    dirtyFields: { ...dirtyFields, title: hasEditedTitle },
    getValues,
    setValue,
  });

  useEffect(() => {
    if (
      !metaErrorMessage ||
      metaLoading ||
      metaErrorUrl !== trimmedUrl ||
      getValues('title').trim()
    )
      return;
    showToast({
      message: metaErrorMessage,
      variant: 'error',
      showIcon: true,
      placement: 'modal-bottom',
    });
    const frame = requestAnimationFrame(() => {
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        active.id === 'url-input' ||
        active.id === 'title-input'
      ) {
        setFocus('title');
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [getValues, metaErrorMessage, metaErrorUrl, metaLoading, setFocus, trimmedUrl]);

  const shouldDisableDetails = !trimmedUrl || !isValidUrl || metaLoading;
  const previewImageUrl = metaData?.image?.trim()
    ? metaData.image
    : '/images/default_linkcard_image.png';

  return {
    form,
    urlValue,
    handleUrlChange,
    handleUrlBlur,
    handleUrlPaste,
    handleTitleChange,
    hasEditedTitle,
    trimmedUrl,
    isValidUrl,
    titleValue,
    memoValue,
    metaData,
    metaLoading,
    metaErrorMessage,
    shouldDisableDetails,
    previewImageUrl,
  };
}
