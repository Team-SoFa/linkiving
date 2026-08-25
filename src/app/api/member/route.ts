import { handleApiError } from '@/hooks/util/api';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

const DELETE_REASONS = new Set([
  'NO_USEFUL_LINKS',
  'POOR_SEARCH',
  'NO_REVISIT',
  'SWITCHED_SERVICE',
  'PRIVACY_CONCERN',
  'OTHER',
]);

const isCrossSiteRequest = (request: Request) => {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return true;

  const origin = request.headers.get('origin');
  return origin ? origin !== new URL(request.url).origin : false;
};

export async function DELETE(request: Request) {
  if (isCrossSiteRequest(request)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (
      !body ||
      body.confirmed !== true ||
      !DELETE_REASONS.has(body.deleteReason) ||
      typeof body.clientId !== 'string' ||
      !/^\d+\.\d+$/.test(body.clientId)
    ) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    await serverApiClient('/v1/member', {
      method: 'DELETE',
      body: JSON.stringify({
        confirmed: true,
        deleteReason: body.deleteReason,
        clientId: body.clientId,
      }),
    });

    const response = NextResponse.json({ success: true });
    const cookieOptions = {
      path: '/',
      ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
      expires: new Date(0),
      sameSite: 'lax' as const,
    };

    response.cookies.set(COOKIES_KEYS.ACCESS_TOKEN, '', cookieOptions);
    response.cookies.set(COOKIES_KEYS.REFRESH_TOKEN, '', cookieOptions);
    response.cookies.set(COOKIES_KEYS.USER_INFO, '', cookieOptions);
    response.cookies.set(COOKIES_KEYS.ACCOUNT_DELETED, 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
