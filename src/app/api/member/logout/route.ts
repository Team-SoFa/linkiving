import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { serverApiClient } from '@/lib/server/apiClient';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;
  let logoutFailed = false;

  try {
    if (accessToken) {
      await serverApiClient('/v1/member/logout', {
        method: 'POST',
      });
    }
  } catch (error) {
    console.warn('Backend logout failed', error);
    logoutFailed = true;
  }

  const response = NextResponse.json(
    { success: !logoutFailed },
    { status: logoutFailed ? 502 : 200 }
  );

  const isProd = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    path: '/',
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}), // 환경변수 기반
    expires: new Date(0),
    sameSite: 'lax' as const,
  };

  response.cookies.set(COOKIES_KEYS.ACCESS_TOKEN, '', cookieOptions);
  response.cookies.set(COOKIES_KEYS.REFRESH_TOKEN, '', cookieOptions);
  response.cookies.set(COOKIES_KEYS.USER_INFO, '', cookieOptions);

  return response;
}
