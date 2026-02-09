import { SafeFetchOptions, safeFetch } from '@/hooks/util/api/fetch/safeFetch';
import type { ReportApiResponse, ReportRequest } from '@/types/api/report';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const authHeaderValue = () => `Bearer ${API_TOKEN}`;

const withAuth = (init?: SafeFetchOptions): SafeFetchOptions => {
  const headers: HeadersInit = {
    Authorization: authHeaderValue(),
    ...(init?.headers ?? {}),
  };

  return {
    timeout: 15_000,
    jsonContentTypeCheck: true,
    ...init,
    headers,
  };
};

export const createReport = async (payload: ReportRequest) => {
  return safeFetch<ReportApiResponse>(
    `${API_BASE_URL}/v1/report`,
    withAuth({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
  );
};
