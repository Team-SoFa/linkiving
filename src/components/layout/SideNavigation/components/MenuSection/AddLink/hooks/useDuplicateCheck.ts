import { fetchLink } from '@/apis/linkApi';
import { useDuplicateLinkMutation } from '@/hooks/useCheckDuplicateLink';
import type { Link } from '@/types/link';
import { useEffect, useState } from 'react';

interface UseDuplicateCheckResult {
  isDuplicate: boolean;
  duplicateLinkId: number | null;
  duplicateLinkData: Link | null;
}

export function useDuplicateCheck(
  trimmedUrl: string,
  isValidUrl: boolean
): UseDuplicateCheckResult {
  const duplicateCheck = useDuplicateLinkMutation();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateLinkId, setDuplicateLinkId] = useState<number | null>(null);
  const [duplicateLinkData, setDuplicateLinkData] = useState<Link | null>(null);

  useEffect(() => {
    if (!trimmedUrl || !isValidUrl) {
      setIsDuplicate(false);
      setDuplicateLinkId(null);
      setDuplicateLinkData(null);
      return;
    }

    let isCancelled = false; // fetchLink 호출 중 URL 변경시 취소 여부

    const timeoutId = setTimeout(() => {
      duplicateCheck.mutate(trimmedUrl, {
        onSuccess: async ({ exists, linkId }) => {
          if (isCancelled) return;
          if (exists && linkId) {
            setIsDuplicate(true);
            setDuplicateLinkId(linkId);
            // 기존 링크 정보 가져오기
            try {
              const link = await fetchLink(linkId);
              if (isCancelled) return;
              setDuplicateLinkData(link);
            } catch {
              setDuplicateLinkData(null);
            }
          } else {
            setIsDuplicate(false);
            setDuplicateLinkId(null);
            setDuplicateLinkData(null);
          }
        },
      });
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedUrl, isValidUrl]);

  return { isDuplicate, duplicateLinkId, duplicateLinkData };
}
