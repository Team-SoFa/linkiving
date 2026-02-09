import { usePostLinkMetaScrape } from '@/hooks/usePostLinkMetaScrape';
import { useEffect, useRef, useState } from 'react';
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

import { FetchError } from './util/api/error/errors';

type MetaData = {
  title: string;
  description: string;
  image: string;
  url: string;
};

type LinkMetaScrapeOptions<T extends FieldValues & { title?: string; memo?: string }> = {
  url: string;
  isValidUrl: boolean;
  dirtyFields: Partial<Record<keyof T, boolean>>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
};

export function useLinkMetaScrape<T extends FieldValues & { title?: string; memo?: string }>({
  url,
  isValidUrl,
  dirtyFields,
  getValues,
  setValue,
}: LinkMetaScrapeOptions<T>) {
  const metaScrape = usePostLinkMetaScrape();
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaErrorMessage, setMetaErrorMessage] = useState<string | null>(null);
  const lastScrapedUrl = useRef<string | null>(null);
  const metaRequestId = useRef(0);
  const titlePath = 'title' as Path<T>;
  const memoPath = 'memo' as Path<T>;

  useEffect(() => {
    if (!url || !isValidUrl) {
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
      if (!dirtyFields.title && getValues(titlePath)) {
        setValue(titlePath, '' as PathValue<T, typeof titlePath>, { shouldValidate: true });
      }
      if (!dirtyFields.memo && getValues(memoPath)) {
        setValue(memoPath, '' as PathValue<T, typeof memoPath>, { shouldValidate: true });
      }
      lastScrapedUrl.current = null;
      return;
    }

    if (url === lastScrapedUrl.current) return;

    if (metaData !== null) {
      setMetaData(null);
    }
    if (metaErrorMessage) {
      setMetaErrorMessage(null);
    }
    if (!dirtyFields.title && getValues(titlePath)) {
      setValue(titlePath, '' as PathValue<T, typeof titlePath>, { shouldValidate: true });
    }
    if (!dirtyFields.memo && getValues(memoPath)) {
      setValue(memoPath, '' as PathValue<T, typeof memoPath>, { shouldValidate: true });
    }
    metaRequestId.current += 1;
    const requestId = metaRequestId.current;
    lastScrapedUrl.current = url;
    if (!metaLoading) {
      setMetaLoading(true);
    }
    const timeoutId = setTimeout(() => {
      metaScrape
        .mutateAsync(url)
        .then(data => {
          if (requestId !== metaRequestId.current) return;
          setMetaData(data);
          setMetaLoading(false);
          if (!dirtyFields.title) {
            setValue(titlePath, (data.title ?? '') as PathValue<T, typeof titlePath>, {
              shouldValidate: true,
            });
          }
          if (!dirtyFields.memo) {
            setValue(memoPath, (data.description ?? '') as PathValue<T, typeof memoPath>, {
              shouldValidate: true,
            });
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
    url,
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

  return { metaData, metaLoading, metaErrorMessage };
}
