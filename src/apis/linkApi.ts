import { clientApiClient } from '@/lib/client/apiClient';
import type {
  DeleteLinkApiResponse,
  DuplicateLinkApiResponse,
  LinkApiResponse,
  LinkCountApiResponse,
  LinkListApiResponse,
  LinkListViewData,
  LinkMetaScrapeApiResponse,
} from '@/types/api/linkApi';
import type { CreateLinkPayload, Link, UpdateLinkPayload } from '@/types/link';

const LINKS_BFF = '/api/links';

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

const normalizeLink = (
  data: Partial<Omit<Link, 'summary'>> & { summary?: { id: number; content: string } | string }
): Link => {
  const now = new Date().toISOString();
  const rawSummary = data.summary;
  const summary =
    rawSummary !== null && typeof rawSummary === 'object'
      ? (rawSummary as { id: number; content: string }).content
      : (rawSummary ?? '');

  return {
    id: data.id ?? 0,
    url: data.url ?? '',
    title: data.title ?? '',
    summary,
    memo: data.memo ?? undefined,
    imageUrl: data.imageUrl ?? '',
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
    summaryStatus: data.summaryStatus,
    summaryProgress: data.summaryProgress,
    summaryUpdatedAt: data.summaryUpdatedAt,
  };
};

// 전체 링크 fetch
export const fetchLinks = async (params?: LinkListParams): Promise<LinkListViewData> => {
  const body = await clientApiClient<LinkListApiResponse>(`${LINKS_BFF}${buildQuery(params)}`);

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return {
    ...body.data,
    content: body.data.links.map(normalizeLink),
  };
};

export const fetchLinksCount = async (): Promise<number> => {
  const body = await clientApiClient<LinkCountApiResponse>('/api/links/count');

  if (!body?.data || typeof body.data.totalCount !== 'number') {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return body.data.totalCount;
};

// 링크 추가
export const createLink = async (payload: CreateLinkPayload): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(LINKS_BFF, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const fetchLink = async (id: number): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(`${LINKS_BFF}/${id}`);

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(`${LINKS_BFF}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkTitle = async (id: number, title: string): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(`${LINKS_BFF}/${id}/title`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const updateLinkMemo = async (id: number, memo: string): Promise<Link> => {
  const body = await clientApiClient<LinkApiResponse>(`${LINKS_BFF}/${id}/memo`, {
    method: 'PATCH',
    body: JSON.stringify({ memo }),
  });

  if (!body?.data || !body.success) {
    throw new Error(body?.message ?? 'Invalid response');
  }

  return normalizeLink(body.data);
};

export const deleteLink = async (id: number): Promise<DeleteLinkApiResponse> => {
  const body = await clientApiClient<DeleteLinkApiResponse>(`${LINKS_BFF}/${id}`, {
    method: 'DELETE',
  });

  if (!body || typeof body.success !== 'boolean' || !body.success) {
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
