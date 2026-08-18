import { useLinkMetaScrape } from '@/hooks/useLinkMetaScrape';
import { EMPTY_URL_MESSAGE, INVALID_URL_MESSAGE, normalizeUrlInput } from '@/lib/url/normalizeUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useRef, useState } from 'react';
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
  title: z.string().trim().min(1, { message: '제목을 입력해 주세요.' }),
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
    formState: { dirtyFields },
  } = form;

  const urlValue = useWatch({ control, name: 'url' });
  const titleValue = useWatch({ control, name: 'title' });
  const memoValue = useWatch({ control, name: 'memo' });
  const [validatedUrl, setValidatedUrl] = useState('');
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

  const handleUrlBlur = useCallback(() => {
    const result = normalizeUrlInput(getValues('url'));

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
  }, [clearErrors, getValues, setError, setValue]);

  const trimmedUrl = useMemo(() => validatedUrl.trim(), [validatedUrl]);
  const isValidUrl = Boolean(validatedUrl);

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

  return {
    form,
    urlValue,
    handleUrlChange,
    handleUrlBlur,
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
