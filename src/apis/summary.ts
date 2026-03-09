import { clientApiClient } from '@/lib/client/apiClient';
import { SummaryData, SummaryResponse } from '@/types/api/summaryApi';

type Params = {
  id: number;
  format?: 'CONCISE' | 'DETAILED';
};

export const fetchNewSummary = async (params: Params): Promise<SummaryData> => {
  const searchParams = new URLSearchParams();
  if (params.format) {
    searchParams.set('format', params.format);
  }
  const endpoint = searchParams.toString()
    ? `/api/links/${params.id}/summary?${searchParams.toString()}`
    : `/api/links/${params.id}/summary`;

  const body = await clientApiClient<SummaryResponse>(endpoint, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response structure');
  }
  return body.data;
};
