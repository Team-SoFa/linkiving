import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { ApiError } from '@/lib/errors/ApiError';
import { serverApiClient } from '@/lib/server/apiClient';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST /api/auth/logout - 로그아웃
export async function POST() {
  const cookieStore = await cookies();
  try {
    // 백엔드 로그아웃 API 호출
    await serverApiClient('/v1/auth/logout', {
      method: 'POST',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    cookieStore.delete(COOKIES_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIES_KEYS.USER_INFO);
  }
}
