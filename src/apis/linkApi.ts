import { type SafeFetchOptions, safeFetch } from '@/hooks/util/api/fetch/safeFetch';
import { clientApiClient } from '@/lib/client/apiClient';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import type {
  DeleteLinkApiResponse,
  DuplicateLinkApiResponse,
  LinkApiResponse,
  LinkListApiResponse,
  LinkListViewData,
  LinkMetaScrapeApiResponse,
  LinkSummaryFormat,
  LinkSummaryRegenerateApiResponse,
} from '@/types/api/linkApi';
import type { CreateLinkPayload, Link, UpdateLinkPayload } from '@/types/link';

const LINKS_BFF = '/api/links';
const getLinksEndpoint = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!apiUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
  }
  return `${apiUrl}/v1/links`;
};

export type LinkListParams = {
  lastId?: number | null;
  size?: number;
};

function buildQuery(params?: LinkListParams) {
  if (!params) return '';
  const usp = new URLSearchParams();
  if (params.lastId !== undefined && params.lastId !== null) {
    usp.set('lastId', String(params.lastId));
  }
  if (params.size !== undefined) usp.set('size', String(params.size));
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

const normalizeLink = (data: Partial<Link>): Link => {
  const now = new Date().toISOString();

  return {
    id: data.id ?? 0,
    url: data.url ?? '',
    title: data.title ?? '',
    summary: data.summary ?? '',
    memo: data.memo ?? undefined,
    imageUrl: data.imageUrl ?? '',
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  };
};

const authHeaderValue = () => {
  if (typeof document === 'undefined') return '';
  const tokenEntry = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIES_KEYS.ACCESS_TOKEN}=`));
  const token = tokenEntry
    ? decodeURIComponent(tokenEntry.substring(`${COOKIES_KEYS.ACCESS_TOKEN}=`.length))
    : '';
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

// 전체 링크 fetch
export const fetchLinks = async (params?: LinkListParams): Promise<LinkListViewData> => {
  const body = await clientApiClient<LinkListApiResponse>(`/api/links${buildQuery(params)}`);

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return {
    ...body.data,
    content: body.data.links.map(normalizeLink),
  };
};

// 링크 추가
export const createLink = async (payload: CreateLinkPayload): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>('/api/links', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const fetchLink = async (id: number): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(`/api/links/${id}`);

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(`/api/links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkTitle = async (id: number, title: string): Promise<Link> => {
  const linksEndpoint = getLinksEndpoint();
  const body = await safeFetch<LinkApiResponse>(
    `${linksEndpoint}/${id}/title`,
    withAuth({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkMemo = async (id: number, memo: string): Promise<Link> => {
  const linksEndpoint = getLinksEndpoint();
  const body = await safeFetch<LinkApiResponse>(
    `${linksEndpoint}/${id}/memo`,
    withAuth({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo }),
    })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const deleteLink = async (id: number): Promise<DeleteLinkApiResponse> => {
  const linksEndpoint = getLinksEndpoint();
  const body = await safeFetch<DeleteLinkApiResponse>(
    `${linksEndpoint}/${id}`,
    withAuth({ method: 'DELETE' })
  );

  if (!body || typeof body.success !== 'boolean' || !body.status || !body.message) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body;
};

// 중복 체크
export const checkDuplicateLink = async (url: string) => {
  const usp = new URLSearchParams({ url });
  const body = await clientApiClient<DuplicateLinkApiResponse>(
    `/api/links/duplicate?${usp.toString()}`
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Failed to check duplicate');
  }

  return body.data;
};

export const scrapeLinkMeta = async (url: string) => {
  const response = await clientApiClient<LinkMetaScrapeApiResponse>('/api/links/meta-scrape', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });

  if (!response?.data || !response.success) {
    throw new Error(response?.message ?? 'Invalid response');
  }

  return response.data;
};

export const regenerateLinkSummary = async (id: number, format: LinkSummaryFormat) => {
  const linksEndpoint = getLinksEndpoint();
  const usp = new URLSearchParams({ format });
  const body = await safeFetch<LinkSummaryRegenerateApiResponse>(
    `${linksEndpoint}/${id}/summary?${usp.toString()}`,
    withAuth({ cache: 'no-store' })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body.data;
};
