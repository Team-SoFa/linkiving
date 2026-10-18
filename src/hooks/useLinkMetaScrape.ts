import { usePostLinkMetaScrape } from '@/hooks/usePostLinkMetaScrape';
import { MAX_TITLE_LENGTH } from '@/lib/constants/link';
import { useEffect, useRef, useState } from 'react';
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

const META_FAILURE_MESSAGE = '링크 정보를 불러오지 못했습니다. 제목을 직접 입력해 주세요.';

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
  skipAutoFill?: boolean; // 추가
};

export function useLinkMetaScrape<T extends FieldValues & { title?: string; memo?: string }>({
  url,
  isValidUrl,
  dirtyFields,
  getValues,
  setValue,
  skipAutoFill,
}: LinkMetaScrapeOptions<T>) {
  const metaScrape = usePostLinkMetaScrape();
  const metaScrapeRef = useRef(metaScrape);
  useEffect(() => {
    metaScrapeRef.current = metaScrape;
  }, [metaScrape]);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaErrorMessage, setMetaErrorMessage] = useState<string | null>(null);
  const [metaErrorUrl, setMetaErrorUrl] = useState<string | null>(null);
  const lastScrapedUrl = useRef<string | null>(null);
  const metaRequestId = useRef(0);
  const titlePath = 'title' as Path<T>;
  const memoPath = 'memo' as Path<T>;

  const dirtyTitleRef = useRef(false);
  const dirtyMemoRef = useRef(false);

  // 수정된 title, memo 참조하도록
  useEffect(() => {
    dirtyTitleRef.current = Boolean(dirtyFields.title);
    dirtyMemoRef.current = Boolean(dirtyFields.memo);
  }, [dirtyFields.title, dirtyFields.memo]);

  const skipAutoFillRef = useRef(skipAutoFill);
  useEffect(() => {
    skipAutoFillRef.current = skipAutoFill;
  }, [skipAutoFill]);

  useEffect(() => {
    if (!url || !isValidUrl) {
      metaRequestId.current += 1;
      if (metaScrapeRef.current.status !== 'idle') {
        metaScrapeRef.current.reset();
      }
      if (metaLoading) {
        setMetaLoading(false);
      }
      if (metaData !== null) {
        setMetaData(null);
      }
      if (metaErrorMessage) {
        setMetaErrorMessage(null);
        setMetaErrorUrl(null);
      }
      if (!dirtyTitleRef.current && !skipAutoFillRef.current) {
        setValue(titlePath, '' as PathValue<T, typeof titlePath>, { shouldValidate: false });
      }
      if (!dirtyMemoRef.current && !skipAutoFillRef.current) {
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
      setMetaErrorUrl(null);
    }
    if (!dirtyTitleRef.current && getValues(titlePath)) {
      setValue(titlePath, '' as PathValue<T, typeof titlePath>, { shouldValidate: false });
    }
    if (!dirtyMemoRef.current && getValues(memoPath)) {
      setValue(memoPath, '' as PathValue<T, typeof memoPath>, { shouldValidate: true });
    }
    metaRequestId.current += 1;
    const requestId = metaRequestId.current;
    if (!metaLoading) {
      setMetaLoading(true);
    }
    const timeoutId = setTimeout(() => {
      lastScrapedUrl.current = url;
      metaScrapeRef.current
        .mutateAsync(url)
        .then(data => {
          if (requestId !== metaRequestId.current) return;
          setMetaData(data);
          setMetaLoading(false);
          if (!data.title?.trim()) {
            setMetaErrorMessage(META_FAILURE_MESSAGE);
            setMetaErrorUrl(url);
          }
          if (!dirtyTitleRef.current && !skipAutoFillRef.current) {
            setValue(
              titlePath,
              (data.title ?? '').slice(0, MAX_TITLE_LENGTH) as PathValue<T, typeof titlePath>,
              {
                shouldValidate: Boolean(data.title?.trim()),
              }
            );
          }
          if (!dirtyMemoRef.current && !skipAutoFillRef.current && getValues(memoPath)) {
            // skipAutoFill 조건 추가
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
          setMetaErrorMessage(META_FAILURE_MESSAGE);
          setMetaErrorUrl(url);
          setMetaLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      metaRequestId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, isValidUrl, setValue, getValues, titlePath, memoPath]);

  return { metaData, metaLoading, metaErrorMessage, metaErrorUrl };
}
