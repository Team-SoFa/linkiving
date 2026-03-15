import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') ?? 'CONCISE';
    if (format !== 'CONCISE' && format !== 'DETAILED') {
      return NextResponse.json({ success: false, message: 'Invalid format.' }, { status: 400 });
    }

    const data = await serverApiClient(`/v1/links/${id}/summary`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body.' }, { status: 400 });
    }

    if (
      typeof body.summary !== 'string' ||
      (body.format !== 'CONCISE' && body.format !== 'DETAILED')
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const data = await serverApiClient(`/v1/links/${id}/summary`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
