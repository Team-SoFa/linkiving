import { type SafeFetchOptions, safeFetch } from '@/hooks/util/server/safeFetch';
import { SummaryData, SummaryResponse } from '@/types/api/summaryApi';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const SUMMARY_ENDPOINT = `${API_URL}/v1/links`;

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

type Params = {
  id: number;
  format?: 'CONCISE' | 'DETAILED';
};

export const fetchNewSummary = async (params: Params): Promise<SummaryData> => {
  const url = new URL(`${SUMMARY_ENDPOINT}/${params.id}/summary`);
  if (params.format) {
    url.searchParams.set('format', params.format);
  }

  const body = await safeFetch<SummaryResponse>(
    url.toString(),
    withAuth({
      method: 'GET',
      timeout: 15_000,
      jsonContentTypeCheck: true,
    })
  );
  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response structure');
  }
  return body.data;
};
