import { useLinkMetaScrape } from '@/hooks/useLinkMetaScrape';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const addLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .url({ message: '유효하지 않은 링크 주소입니다. URL을 다시 확인해 주세요.' }),
  title: z.string().min(1, { message: '제목을 입력해 주세요.' }),
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
    setValue,
    getValues,
    formState: { dirtyFields },
  } = form;

  const urlValue = useWatch({ control, name: 'url' });
  const titleValue = useWatch({ control, name: 'title' });
  const memoValue = useWatch({ control, name: 'memo' });

  const trimmedUrl = useMemo(() => urlValue?.trim() ?? '', [urlValue]);
  const isValidUrl = useMemo(() => z.string().url().safeParse(trimmedUrl).success, [trimmedUrl]);

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
