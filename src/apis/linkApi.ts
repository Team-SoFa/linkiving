import { clientApiClient } from '@/lib/client/apiClient';
import { ApiError } from '@/lib/errors/ApiError';
import type {
  DeleteLinkApiResponse,
  DuplicateLinkApiResponse,
  LinkApiResponse,
  LinkCountApiResponse,
  LinkListApiResponse,
  LinkListViewData,
  LinkMetaScrapeApiResponse,
  LinkSummaryStatusApiResponse,
  LinkSummaryStatusData,
  SummaryStatusResponse,
} from '@/types/api/linkApi';
import type { CreateLinkPayload, Link, LinkSummaryStatus, UpdateLinkPayload } from '@/types/link';

const LINKS_BFF = '/api/links';

export type LinkListParams = {
  lastId?: number | null;
  size?: number;
};

const RAW_TO_LINK_SUMMARY_STATUS: Record<SummaryStatusResponse, LinkSummaryStatus> = {
  PENDING: 'generating',
  PROCESSING: 'generating',
  COMPLETED: 'ready',
  FAILED: 'failed',
};

const isRawSummaryStatus = (value: unknown): value is SummaryStatusResponse =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(RAW_TO_LINK_SUMMARY_STATUS, value);

const isLinkSummaryStatus = (value: unknown): value is LinkSummaryStatus =>
  value === 'idle' || value === 'generating' || value === 'ready' || value === 'failed';

const hasText = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const resolveSummaryContent = (
  rawSummary: { id?: number; content?: string } | string | null | undefined
): string => {
  if (rawSummary !== null && typeof rawSummary === 'object') {
    return typeof rawSummary.content === 'string' ? rawSummary.content : '';
  }

  return typeof rawSummary === 'string' ? rawSummary : '';
};

export const normalizeLinkSummaryStatus = (
  rawStatus: unknown,
  summary: string | null | undefined,
  errorMessage?: string | null
): LinkSummaryStatus => {
  if (isLinkSummaryStatus(rawStatus)) return rawStatus;
  if (isRawSummaryStatus(rawStatus)) return RAW_TO_LINK_SUMMARY_STATUS[rawStatus];
  if (hasText(errorMessage)) return 'failed';
  if (hasText(summary)) return 'ready';
  return 'idle';
};

const resolveInitialLinkSummaryStatus = (
  rawStatus: unknown,
  summary: string,
  errorMessage?: string | null
): LinkSummaryStatus | undefined => {
  if (isLinkSummaryStatus(rawStatus) || isRawSummaryStatus(rawStatus)) {
    return normalizeLinkSummaryStatus(rawStatus, summary, errorMessage);
  }

  if (hasText(errorMessage)) return 'failed';
  if (hasText(summary)) return 'ready';
  return undefined;
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

type LinkSource = {
  id?: number;
  url?: string;
  title?: string;
  summary?: { id: number; content: string } | string | null;
  summaryStatus?: unknown;
  summaryErrorMessage?: string | null;
  summaryProgress?: number | null;
  summaryUpdatedAt?: string | null;
  memo?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const normalizeLink = (data: LinkSource): Link => {
  const now = new Date().toISOString();
  const summary = resolveSummaryContent(data.summary);
  const summaryStatus = resolveInitialLinkSummaryStatus(
    data.summaryStatus,
    summary,
    data.summaryErrorMessage
  );

  return {
    id: data.id ?? 0,
    url: data.url ?? '',
    title: data.title ?? '',
    summary,
    memo: data.memo ?? undefined,
    imageUrl: data.imageUrl ?? '',
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
    summaryStatus,
    summaryProgress: typeof data.summaryProgress === 'number' ? data.summaryProgress : undefined,
    summaryUpdatedAt: data.summaryUpdatedAt ?? undefined,
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

export const fetchLinkSummaryStatus = async (id: number): Promise<LinkSummaryStatusData> => {
  const body = await clientApiClient<LinkSummaryStatusApiResponse>(
    `/api/links/${id}/summary-status`,
    {
      method: 'GET',
    }
  );

  if (!body?.data || !body.success) {
    const status =
      typeof body?.status === 'number'
        ? body.status
        : typeof body?.status === 'string' && Number.isFinite(Number(body.status))
          ? Number(body.status)
          : 500;

    throw new ApiError(status, body?.message ?? 'Invalid response', body);
  }

  return body.data;
};
