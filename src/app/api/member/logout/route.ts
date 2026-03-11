import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { serverApiClient } from '@/lib/server/apiClient';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;

  try {
    if (accessToken) {
      await serverApiClient('/v1/member/logout', {
        method: 'POST',
      });
    }
  } catch (error) {
    console.warn('Backend logout failed', error);
  } finally {
    cookieStore.delete(COOKIES_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIES_KEYS.REFRESH_TOKEN);
    cookieStore.delete(COOKIES_KEYS.USER_INFO);
  }

  return NextResponse.json({ success: true });
}
