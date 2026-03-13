import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: 'No authentication token',
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      authorization: `Bearer ${token}`,
    },
  });
}
