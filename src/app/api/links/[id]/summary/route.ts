import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

const ALLOWED_FORMATS = new Set(['CONCISE', 'DETAILED']);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    if (format !== null && !ALLOWED_FORMATS.has(format)) {
      return NextResponse.json(
        { success: false, message: 'Invalid format. Use CONCISE or DETAILED.' },
        { status: 400 }
      );
    }

    const query = format ? `?format=${encodeURIComponent(format)}` : '';
    const data = await serverApiClient(`/v1/links/${id}/summary${query}`);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
