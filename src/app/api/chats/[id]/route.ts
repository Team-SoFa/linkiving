import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

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
