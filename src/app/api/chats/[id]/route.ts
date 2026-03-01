import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get('lastId');
    const size = searchParams.get('size');

    const qs = new URLSearchParams();
    if (lastId) qs.set('lastId', lastId);
    if (size) qs.set('size', size);

    const endpoint = qs.toString() ? `/v1/chats/${id}?${qs}` : `/v1/chats/${id}`;
    const data = await serverApiClient(endpoint);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await serverApiClient(`/v1/chats/${id}`, {
      method: 'DELETE',
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
