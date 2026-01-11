import { type SafeFetchOptions, safeFetch } from '@/hooks/util/api/fetch/safeFetch';
import type {
  DeleteLinkApiResponse,
  DuplicateLinkApiResponse,
  LinkApiResponse,
  LinkListApiResponse,
  LinkListViewData,
} from '@/types/api/linkApi';
import type { CreateLinkPayload, Link, UpdateLinkPayload } from '@/types/link';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

if (!API_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}

if (!API_TOKEN) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_TOKEN');
}

const LINKS_ENDPOINT = `${API_URL}/v1/links`;

export type LinkListParams = {
  page?: number;
  size?: number;
  sort?: string[] | string;
};

function buildQuery(params?: LinkListParams) {
  if (!params) return '';
  const usp = new URLSearchParams();
  if (params.page !== undefined) usp.set('page', String(params.page));
  if (params.size !== undefined) usp.set('size', String(params.size));
  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    sorts.forEach(s => usp.append('sort', s));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

const withAuth = (init?: SafeFetchOptions): SafeFetchOptions => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${API_TOKEN}`,
    ...(init?.headers ?? {}),
  };

  return {
    timeout: 15_000,
    jsonContentTypeCheck: true,
    ...init,
    headers,
  };
};

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

export const fetchLinks = async (params?: LinkListParams): Promise<LinkListViewData> => {
  const body = await safeFetch<LinkListApiResponse>(
    `${LINKS_ENDPOINT}${buildQuery(params)}`,
    withAuth({ cache: 'no-store' })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return {
    ...body.data,
    content: body.data.content.map(normalizeLink),
  };
};

export const createLink = async (payload: CreateLinkPayload): Promise<Link> => {
  const body = await safeFetch<LinkApiResponse>(
    LINKS_ENDPOINT,
    withAuth({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const fetchLink = async (id: number): Promise<Link> => {
  const body = await safeFetch<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    withAuth({ cache: 'no-store' })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const body = await safeFetch<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    withAuth({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkTitle = async (id: number, title: string): Promise<Link> => {
  const body = await safeFetch<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}/title`,
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
  const body = await safeFetch<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}/memo`,
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
  const body = await safeFetch<DeleteLinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    withAuth({ method: 'DELETE' })
  );

  if (!body || typeof body.success !== 'boolean' || !body.status || !body.message) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body;
};

export const checkDuplicateLink = async (
  url: string
): Promise<{ exists: boolean; linkId?: number }> => {
  const usp = new URLSearchParams({ url });
  const body = await safeFetch<DuplicateLinkApiResponse>(
    `${LINKS_ENDPOINT}/duplicate?${usp.toString()}`,
    withAuth({ cache: 'no-store' })
  );

  if (!body?.data || typeof body.data.exists !== 'boolean') {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return { exists: body.data.exists, linkId: body.data.linkId };
};
