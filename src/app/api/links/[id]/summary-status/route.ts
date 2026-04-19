import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

const UPSTREAM_SUMMARY_STATUS_ENDPOINTS = [
  (id: string) => `/v1/links/${id}/summary-status`,
  (id: string) => `/v1/links/${id}/status`,
  (id: string) => `/v1/links/${id}/summary/status`,
];
type SummaryStatusEndpointResolver = (typeof UPSTREAM_SUMMARY_STATUS_ENDPOINTS)[number];

let resolvedSummaryStatusEndpoint: SummaryStatusEndpointResolver | null = null;

const getErrorStatus = (error: unknown): number | null => {
  if (!error || typeof error !== 'object' || !('status' in error)) return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
};

const isEndpointMissing404 = (error: unknown): boolean => getErrorStatus(error) === 404;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsedId = Number(id);
    const triedEndpoints = new Set<SummaryStatusEndpointResolver>();

    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    if (resolvedSummaryStatusEndpoint) {
      triedEndpoints.add(resolvedSummaryStatusEndpoint);

      try {
        const data = await serverApiClient(resolvedSummaryStatusEndpoint(id), { method: 'GET' });
        return NextResponse.json(data, { status: 200 });
      } catch (error) {
        if (!isEndpointMissing404(error)) {
          throw error;
        }

        resolvedSummaryStatusEndpoint = null;
      }
    }

    for (const endpointResolver of UPSTREAM_SUMMARY_STATUS_ENDPOINTS) {
      if (triedEndpoints.has(endpointResolver)) continue;

      try {
        const data = await serverApiClient(endpointResolver(id), { method: 'GET' });
        resolvedSummaryStatusEndpoint = endpointResolver;
        return NextResponse.json(data, { status: 200 });
      } catch (error) {
        if (isEndpointMissing404(error)) {
          triedEndpoints.add(endpointResolver);
          continue;
        }

        throw error;
      }
    }

    return NextResponse.json(
      { success: false, message: 'Summary status endpoint is not available.' },
      { status: 404 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
