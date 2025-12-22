import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 });
  }

  // CSRF 보호를 위한 state 생성
  const state = randomBytes(32).toString('hex');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  googleAuthUrl.searchParams.append('client_id', clientId);
  googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'email profile');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');
  googleAuthUrl.searchParams.append('state', state);

  // state를 쿠키에 저장 후, 콜백에서 검증
  const res = NextResponse.redirect(googleAuthUrl.toString());
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10분
    path: '/',
  });

  return res;
}
