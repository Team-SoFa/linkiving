import { isExpiredJwt, needsTermsAgreement } from '@/lib/auth/jwt';
import {
  AuthTokenData,
  TokenResponse,
  extractAuthTokens,
  getAuthCookieOptions,
} from '@/lib/auth/token';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/signup'];
const TERMS_ROUTE = '/terms';
const ACCOUNT_DELETED_ROUTE = '/account-deleted';
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const AUTH_REFRESH_ENDPOINT = process.env.AUTH_REFRESH_ENDPOINT ?? '/v1/auth/reissue';
const DEV_BYPASS_LOGIN =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_BYPASS_LOGIN === 'true';
const DEV_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN;

const setAuthCookies = (response: NextResponse, tokens: AuthTokenData) => {
  response.cookies.set(
    COOKIES_KEYS.ACCESS_TOKEN,
    tokens.accessToken,
    getAuthCookieOptions(tokens.accessToken)
  );

  if (tokens.refreshToken) {
    response.cookies.set(
      COOKIES_KEYS.REFRESH_TOKEN,
      tokens.refreshToken,
      getAuthCookieOptions(tokens.refreshToken)
    );
  }
};

const reissueTokens = async (refreshToken: string) => {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_REFRESH_ENDPOINT}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Cookie: `${COOKIES_KEYS.REFRESH_TOKEN}=${encodeURIComponent(refreshToken)}`,
    },
  });

  if (!response.ok) return null;

  const tokenResponse = (await response.json().catch(() => null)) as TokenResponse;
  const tokens = extractAuthTokens(tokenResponse, response.headers);

  return tokens;
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = req.cookies.get(COOKIES_KEYS.REFRESH_TOKEN)?.value;
  const { pathname } = req.nextUrl;
  const isTermsRoute = pathname === TERMS_ROUTE;
  const isAccountDeletedRoute = pathname === ACCOUNT_DELETED_ROUTE;

  if (isAccountDeletedRoute) {
    const completed = req.cookies.get(COOKIES_KEYS.ACCOUNT_DELETED)?.value === 'true';

    if (!completed) {
      return NextResponse.redirect(new URL(token ? '/home' : '/', req.url));
    }

    const response = NextResponse.next();
    response.cookies.set(COOKIES_KEYS.ACCOUNT_DELETED, '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
    });
    return response;
  }

  if (DEV_BYPASS_LOGIN) {
    if (publicRoutes.includes(pathname)) {
      const response = NextResponse.redirect(new URL('/home', req.url));
      if (!token && DEV_ACCESS_TOKEN) {
        response.cookies.set(COOKIES_KEYS.ACCESS_TOKEN, DEV_ACCESS_TOKEN, {
          path: '/',
          sameSite: 'lax',
        });
      }
      return response;
    }

    if (!token && DEV_ACCESS_TOKEN) {
      const response = NextResponse.next();
      response.cookies.set(COOKIES_KEYS.ACCESS_TOKEN, DEV_ACCESS_TOKEN, {
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }

    if (isTermsRoute) {
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    if (token && !isExpiredJwt(token)) {
      const response = NextResponse.redirect(new URL('/home', req.url));
      return response;
    }

    if (refreshToken) {
      const tokens = await reissueTokens(refreshToken);
      if (tokens) {
        const response = NextResponse.redirect(new URL('/home', req.url));
        setAuthCookies(response, tokens);
        return response;
      }
    }

    return NextResponse.next();
  }

  if (isTermsRoute) {
    if (token && !isExpiredJwt(token)) {
      return needsTermsAgreement(token)
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/home', req.url));
    }

    if (refreshToken) {
      const tokens = await reissueTokens(refreshToken);
      if (tokens) {
        const response = needsTermsAgreement(tokens.accessToken)
          ? NextResponse.next()
          : NextResponse.redirect(new URL('/home', req.url));
        setAuthCookies(response, tokens);
        return response;
      }
    }

    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!token || isExpiredJwt(token)) {
    if (refreshToken) {
      const tokens = await reissueTokens(refreshToken);
      if (tokens) {
        const response = needsTermsAgreement(tokens.accessToken)
          ? NextResponse.redirect(new URL(TERMS_ROUTE, req.url))
          : NextResponse.next();
        setAuthCookies(response, tokens);
        return response;
      }
    }

    const loginUrl = new URL('/', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (needsTermsAgreement(token)) {
    return NextResponse.redirect(new URL(TERMS_ROUTE, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images|monitoring).*)'],
};
