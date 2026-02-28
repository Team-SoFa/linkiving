import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const data = await serverApiClient(`/v1/links/duplicate?url=${encodeURIComponent(url ?? '')}`); // url이 비었을 경우 빈 문자열 전달
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
