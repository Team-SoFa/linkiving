import { safeFetch } from '@/hooks/util/server/safeFetch';
import { SummaryData, SummaryRes } from '@/types/api/summaryApi';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

if (!API_URL) throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
if (!API_TOKEN) throw new Error('Missing environment variable: NEXT_PUBLIC_API_TOKEN');

const SUMMARY_ENDPOINT = `${API_URL}/v1/links`;

type Params = {
  id: number;
  format?: 'CONCISE' | 'DETAILED';
};

export const fetchNewSummary = async (params: Params): Promise<SummaryData> => {
  const url = new URL(`${SUMMARY_ENDPOINT}/${params.id}/summary`);
  if (params.format) {
    url.searchParams.set('format', params.format);
  }

  const body = await safeFetch<SummaryRes>(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    timeout: 15_000,
    jsonContentTypeCheck: true,
  });
  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response structure');
  }
  return body.data;
};
