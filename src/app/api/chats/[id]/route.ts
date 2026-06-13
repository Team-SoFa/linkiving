import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

const parseOptionalSize = (value: string | null) => {
  if (value === null) return { valid: true, parsed: null as number | null };
  if (!/^\d+$/.test(value)) return { valid: false, parsed: null as number | null };

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) return { valid: false, parsed: null as number | null };
  return { valid: true, parsed };
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const safeId = encodeURIComponent(id);
    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get('lastId');
    const size = searchParams.get('size');
    const parsedSize = parseOptionalSize(size);
    const trimmedLastId = lastId?.trim() ?? null;

    if (!parsedSize.valid) {
      return NextResponse.json(
        {
          success: false,
          status: 'BAD_REQUEST',
          message: 'Invalid query parameter: size must be numeric.',
        },
        { status: 400 }
      );
    }

    const qs = new URLSearchParams();
    if (trimmedLastId) qs.set('lastId', trimmedLastId);
    if (parsedSize.parsed !== null) qs.set('size', String(parsedSize.parsed));

    const endpoint = qs.toString() ? `/v1/chats/${safeId}?${qs}` : `/v1/chats/${safeId}`;
    const data = await serverApiClient(endpoint);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const safeId = encodeURIComponent(id);
    const data = await serverApiClient(`/v1/chats/${safeId}`, {
      method: 'DELETE',
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
