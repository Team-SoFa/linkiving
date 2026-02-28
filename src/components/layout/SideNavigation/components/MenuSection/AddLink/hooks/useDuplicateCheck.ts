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

    const timeoutId = setTimeout(() => {
      duplicateCheck.mutate(trimmedUrl, {
        onSuccess: async ({ exists, linkId }) => {
          if (exists && linkId) {
            setIsDuplicate(true);
            setDuplicateLinkId(linkId);
            // 기존 링크 정보 가져오기
            try {
              const link = await fetchLink(linkId);
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

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedUrl, isValidUrl]);

  return { isDuplicate, duplicateLinkId, duplicateLinkData };
}
