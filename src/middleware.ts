import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/'];
const DEV_BYPASS_LOGIN =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_BYPASS_LOGIN === 'true';
const DEV_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN;

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;
  const { pathname } = req.nextUrl;

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

    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images|monitoring).*)'],
};
