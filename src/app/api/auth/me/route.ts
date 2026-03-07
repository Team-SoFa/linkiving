import { handleApiError } from '@/hooks/util/api';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    const res = await fetch(`${API_BASE}/v1/member/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: res.status });
    }

    const user = await res.json();

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
