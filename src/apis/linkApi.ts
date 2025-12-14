import type { CreateLinkPayload, Link, PageResponse, UpdateLinkPayload } from '@/types/link';

const LINKS_ENDPOINT = '/api/links';

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

export const fetchLinks = async (params?: LinkListParams): Promise<PageResponse<Link>> => {
  const res = await fetch(`${LINKS_ENDPOINT}${buildQuery(params)}`, { cache: 'no-store' });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = (errorBody as { error?: string } | null)?.error ?? 'Failed to fetch links';
    throw new Error(message);
  }

  const body = (await res.json()) as {
    data?: PageResponse<Link>;
  };

  if (!body?.data) {
    throw new Error('Invalid response');
  }

  return body.data;
};

export const createLink = async (payload: CreateLinkPayload): Promise<Link> => {
  const res = await fetch(LINKS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = (errorBody as { error?: string } | null)?.error ?? 'Failed to create link';
    throw new Error(message);
  }

  const body = (await res.json()) as { data?: Link };
  if (!body?.data) {
    throw new Error('Invalid response');
  }

  return body.data;
};

export const fetchLink = async (id: number): Promise<Link> => {
  const res = await fetch(`${LINKS_ENDPOINT}/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = (errorBody as { error?: string } | null)?.error ?? 'Failed to fetch link';
    throw new Error(message);
  }

  const body = (await res.json()) as { data?: Link };
  if (!body?.data) {
    throw new Error('Invalid response');
  }

  return body.data;
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const res = await fetch(`${LINKS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = (errorBody as { error?: string } | null)?.error ?? 'Failed to update link';
    throw new Error(message);
  }

  const body = (await res.json()) as { data?: Link };
  if (!body?.data) {
    throw new Error('Invalid response');
  }

  return body.data;
};

export const updateLinkTitle = async (id: number, title: string): Promise<Link> => {
  const res = await fetch(`${LINKS_ENDPOINT}/${id}/title`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message =
      (errorBody as { error?: string } | null)?.error ?? 'Failed to update link title';
    throw new Error(message);
  }

  const body = (await res.json()) as { data?: Link };
  if (!body?.data) {
    throw new Error('Invalid response');
  }

  return body.data;
};

export const updateLinkMemo = async (id: number, memo: string): Promise<Link> => {
  const res = await fetch(`${LINKS_ENDPOINT}/${id}/memo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memo }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = (errorBody as { error?: string } | null)?.error ?? 'Failed to update link memo';
    throw new Error(message);
  }

  const body = (await res.json()) as { data?: Link };
  if (!body?.data) {
    throw new Error('Invalid response');
  }

  return body.data;
};

export const deleteLink = async (
  id: number
): Promise<{
  success: boolean;
  status: string;
  message: string;
  data: string;
  timestamp: string;
}> => {
  const res = await fetch(`${LINKS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = (errorBody as { error?: string } | null)?.error ?? 'Failed to delete link';
    throw new Error(message);
  }

  const body = (await res.json()) as {
    success: boolean;
    status: string;
    message: string;
    data: string;
    timestamp: string;
  };

  if (!body || typeof body.success !== 'boolean' || !body.status || !body.message) {
    throw new Error('Invalid response');
  }

  return body;
};

export const checkDuplicateLink = async (url: string): Promise<boolean> => {
  const usp = new URLSearchParams({ url });
  const res = await fetch(`${LINKS_ENDPOINT}/duplicate?${usp.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message =
      (errorBody as { error?: string } | null)?.error ?? 'Failed to check duplicate link';
    throw new Error(message);
  }

  const body = (await res.json()) as { data?: boolean };
  if (typeof body?.data !== 'boolean') {
    throw new Error('Invalid response');
  }

  return body.data;
};
