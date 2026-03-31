'use client';

import { fetchLinksCount } from '@/apis/linkApi';
import { useQuery } from '@tanstack/react-query';

export default function useLinkCount() {
  const query = useQuery({
    queryKey: ['linkCount'],
    queryFn: fetchLinksCount,
  });

  return {
    count: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
