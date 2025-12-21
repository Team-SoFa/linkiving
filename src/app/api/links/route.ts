import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_TOKEN = process.env.API_TOKEN;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const res = await fetch(`${API_URL}/v1/links?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const text = await res.text();

  console.log('[BFF] status:', res.status);
  console.log('[BFF] content-type:', res.headers.get('content-type'));
  console.log('[BFF] body:', text);

  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') ?? 'text/plain' },
  });
}
