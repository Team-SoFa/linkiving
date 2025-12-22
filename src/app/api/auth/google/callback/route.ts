import { FetchError, safeFetch } from '@/hooks/util/server/safeFetch';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface BackendLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const savedState = cookieStore.get('oauth_state')?.value;

  if (!state || !savedState || state !== savedState) {
    console.error('State validation failed');
    return NextResponse.redirect(new URL('/'));
  }

  cookieStore.delete('oauth_state');

  if (error || !code) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    // access token 교환
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange token');
    }
    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // user info 가져오기
    const userInfo = await safeFetch<GoogleUserInfo>(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        timeout: 5000,
      }
    );

    const { token, user } = await safeFetch<BackendLoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          accessToken: tokens.access_token,
        }),
        timeout: 8000,
      }
    );

    // 쿠키에 토큰 저장
    const cookieStore = await cookies();
    cookieStore.set(COOKIES_KEYS.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    // 쿠키에 사용자 정보 저장 (useAuth에서 사용)
    cookieStore.set(COOKIES_KEYS.USER_INFO, JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.redirect(new URL('/home', req.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    if (error instanceof FetchError) {
      console.error('FetchError details:', {
        status: error.status,
        body: error.body,
        contentType: error.contentType,
      });
    }
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}
