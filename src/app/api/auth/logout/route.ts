import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const reqHeaders = await headers();
  const origin = reqHeaders.get('origin');
  const referer = reqHeaders.get('referer');

  // same-origin 요청인지 확인
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);

  const isValidOrigin = origin && allowedOrigins.some(allowed => origin.startsWith(allowed!));
  const isValidReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed!));

  if (!isValidOrigin && !isValidReferer) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 403 });
  }
  const cookieStore = await cookies();

  cookieStore.delete(COOKIES_KEYS.AUTH_TOKEN);
  cookieStore.delete(COOKIES_KEYS.USER_INFO);

  return NextResponse.json({ success: true });
}
