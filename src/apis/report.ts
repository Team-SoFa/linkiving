import { backendApiClient } from '@/lib/client/backendClient';
import type { ReportApiResponse, ReportRequest } from '@/types/api/report';

export const createReport = async (payload: ReportRequest) => {
  const res = await backendApiClient<ReportApiResponse>('/api/report', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data) {
    throw new Error(res.message ?? 'Failed to create report');
  }

  return res.data;
};
