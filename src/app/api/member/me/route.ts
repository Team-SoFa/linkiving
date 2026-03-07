import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await serverApiClient('/v1/member/me');
    return NextResponse.json(data);
  } catch (err) {
    console.error('route error:', err);
    return handleApiError(err);
  }
}
