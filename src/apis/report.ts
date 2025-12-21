import { safeFetch } from '@/hooks/util/server/safeFetch';
import type { ReportApiResponse, ReportRequest } from '@/types/api/report';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createReport = async (payload: ReportRequest) => {
  return safeFetch<ReportApiResponse>(`${BASE_URL}/v1/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};
