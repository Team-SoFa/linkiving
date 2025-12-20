import type {
  DeleteLinkApiResponse,
  DuplicateLinkApiResponse,
  LinkApiResponse,
  LinkListApiResponse,
  LinkListViewData,
} from '@/types/api/linkApi';
import type { CreateLinkPayload, Link, UpdateLinkPayload } from '@/types/link';

import { request } from './http';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://43.200.105.93';
const LINKS_ENDPOINT = `${API_BASE_URL}/v1/links`;
const DEV_FALLBACK_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBsaW5raXZpbmcuY29tIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2NjA3NjEwNSwiZXhwIjo5NzY2MDc5NzA1fQ.Gmc1VkeGtG4stsg5px1tWWG7c6BU8zKjkVTpJBgaAkY';

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

const withAuth = (init?: RequestInit): RequestInit => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN ?? DEV_FALLBACK_TOKEN;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(init?.headers ?? {}),
  };

  return { ...init, headers };
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
  const body = await request<LinkListApiResponse>(
    `${LINKS_ENDPOINT}${buildQuery(params)}`,
    withAuth({ cache: 'no-store' }),
    'Failed to fetch links'
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
  const body = await request<LinkApiResponse>(
    LINKS_ENDPOINT,
    withAuth({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    'Failed to create link'
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const fetchLink = async (id: number): Promise<Link> => {
  const body = await request<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    withAuth({ cache: 'no-store' }),
    'Failed to fetch link'
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const body = await request<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    withAuth({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    'Failed to update link'
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkTitle = async (id: number, title: string): Promise<Link> => {
  const body = await request<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}/title`,
    withAuth({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }),
    'Failed to update link title'
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkMemo = async (id: number, memo: string): Promise<Link> => {
  const body = await request<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}/memo`,
    withAuth({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo }),
    }),
    'Failed to update link memo'
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const deleteLink = async (id: number): Promise<DeleteLinkApiResponse> => {
  const body = await request<DeleteLinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    withAuth({ method: 'DELETE' }),
    'Failed to delete link'
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
  const body = await request<DuplicateLinkApiResponse>(
    `${LINKS_ENDPOINT}/duplicate?${usp.toString()}`,
    withAuth({ cache: 'no-store' }),
    'Failed to check duplicate link'
  );

  if (!body?.data || typeof body.data.exists !== 'boolean') {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return { exists: body.data.exists, linkId: body.data.linkId };
};
