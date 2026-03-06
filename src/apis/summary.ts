import { type SafeFetchOptions, safeFetch } from '@/hooks/util/api/fetch/safeFetch';
import { SummaryData, SummaryResponse } from '@/types/api/summaryApi';

const getSummaryEndpoint = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!apiUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
  }
  return `${apiUrl}/v1/links`;
};

const authHeaderValue = () => {
  if (typeof document === 'undefined') return '';
  const tokenEntry = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
  const token = tokenEntry ? decodeURIComponent(tokenEntry.substring('accessToken='.length)) : '';
  return token ? `Bearer ${token}` : '';
};

const withAuth = (init?: SafeFetchOptions): SafeFetchOptions => {
  const authorization = authHeaderValue();
  const headers: HeadersInit = {
    ...(authorization ? { Authorization: authorization } : {}),
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
  const summaryEndpoint = getSummaryEndpoint();
  const url = `${summaryEndpoint}/${params.id}/summary`;
  const searchParams = new URLSearchParams();
  if (params.format) {
    searchParams.set('format', params.format);
  }
  const endpoint = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  const body = await safeFetch<SummaryResponse>(
    endpoint,
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
