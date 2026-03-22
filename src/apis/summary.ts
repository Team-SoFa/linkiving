import { clientApiClient } from '@/lib/client/apiClient';
import type {
  RegenerateSummaryParams,
  SelectSummaryParams,
  SelectSummaryResponse,
  SummaryResponse,
} from '@/types/api/summaryApi';

export const retrySummary = async (id: number) => {
  const body = await clientApiClient<SummaryResponse>(`/api/links/${id}/retry-summary`, {
    method: 'POST',
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response structure');
  }

  return body.data;
};

export const fetchNewSummary = async (params: RegenerateSummaryParams) => {
  const format = params.format ?? 'CONCISE';
  const body = await clientApiClient<SummaryResponse>(
    `/api/links/${params.id}/summary?format=${format}`,
    { method: 'POST' }
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response structure');
  }

  return body.data;
};

export const selectNewSummary = async (params: SelectSummaryParams) => {
  const body = await clientApiClient<SelectSummaryResponse>(`/api/links/${params.id}/summary`, {
    method: 'PATCH',
    body: JSON.stringify({
      summary: params.summary,
      format: params.format,
    }),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response structure');
  }

  return body.data;
};
