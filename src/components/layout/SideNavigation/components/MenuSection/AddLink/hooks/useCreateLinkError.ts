// 에러 및 재시도 로직
import { usePostLinks } from '@/hooks/usePostLinks';
import { hideToast, showToast } from '@/stores/toastStore';
import { useEffect, useRef, useState } from 'react';

interface UseCreateLinkErrorOptions {
  createLink: ReturnType<typeof usePostLinks>;
  trimmedUrl: string;
  titleValue: string | undefined;
  memoValue: string | undefined;
  onRetry: (payload: {
    url: string;
    title: string;
    memo?: string;
    imageUrl?: string;
  }) => Promise<void>;
}

export function useCreateLinkError({
  createLink,
  trimmedUrl,
  titleValue,
  memoValue,
  onRetry,
}: UseCreateLinkErrorOptions) {
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const lastSubmitErrorRef = useRef<Error | null>(null);
  const lastSubmitPayloadRef = useRef<{
    url: string;
    title: string;
    memo?: string;
    imageUrl?: string;
  } | null>(null);
  const lastInputsRef = useRef({ trimmedUrl, titleValue, memoValue });

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
        const payload = lastSubmitPayloadRef.current;
        if (!payload) return;
        hideToast(toastId);
        lastSubmitErrorRef.current = null;
        onRetry(payload);
      },
    });
  }, [createLink.isError, createLink.error, onRetry]);

  return { hasSubmitError, lastSubmitPayloadRef };
}
