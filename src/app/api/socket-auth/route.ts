import { getValidAccessToken } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = await getValidAccessToken();

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
