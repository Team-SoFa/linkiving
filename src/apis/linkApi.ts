// apis/linkApi.ts (BFF 기준으로 정리된 최종본)
import { type SafeFetchOptions, safeFetch } from '@/hooks/util/server/safeFetch';
import type {
  DeleteLinkApiResponse,
  DuplicateLinkApiResponse,
  LinkApiResponse,
  LinkListApiResponse,
  LinkListViewData,
} from '@/types/api/linkApi';
import type { CreateLinkPayload, Link, UpdateLinkPayload } from '@/types/link';

// ✅ BFF 엔드포인트
const LINKS_ENDPOINT = '/api/links';

export type LinkListParams = {
  lastId?: number;
  size?: number;
};

function buildQuery(params?: LinkListParams) {
  if (!params) return '';

  const usp = new URLSearchParams();

  if (params.lastId !== undefined) usp.set('lastId', String(params.lastId));
  if (params.size !== undefined) usp.set('size', String(params.size));

  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

// ✅ Authorization 제거 (BFF가 처리)
const baseOptions = (init?: SafeFetchOptions): SafeFetchOptions => ({
  timeout: 15_000,
  jsonContentTypeCheck: false,
  ...init,
});

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
    baseOptions({ cache: 'no-store' })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return {
    links: body.data.links.map(normalizeLink),
    hasNext: body.data.hasNext,
    lastId: body.data.lastId,
  };
};

export const createLink = async (payload: CreateLinkPayload): Promise<Link> => {
  const body = await safeFetch<LinkApiResponse>(
    LINKS_ENDPOINT,
    baseOptions({
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
    baseOptions({ cache: 'no-store' })
  );

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const body = await safeFetch<LinkApiResponse>(
    `${LINKS_ENDPOINT}/${id}`,
    baseOptions({
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
    baseOptions({
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
    baseOptions({
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
    baseOptions({ method: 'DELETE' })
  );

  if (!body || typeof body.success !== 'boolean') {
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
    baseOptions({ cache: 'no-store' })
  );

  if (!body?.data || typeof body.data.exists !== 'boolean') {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return { exists: body.data.exists, linkId: body.data.linkId };
};
