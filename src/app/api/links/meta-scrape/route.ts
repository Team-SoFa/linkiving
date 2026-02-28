import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await serverApiClient('/v1/links/meta-scrape', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
