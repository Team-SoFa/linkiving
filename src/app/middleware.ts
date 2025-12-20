import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/'];

export function middleware(req: NextRequest) {
  // TODO: 개발용 임시 코드로, 추후 삭제
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
    return NextResponse.next();
  }
  //

  const token = req.cookies.get(COOKIES_KEYS.ACCESS_TOKEN);
  const { pathname } = req.nextUrl;

  // 랜딩 페이지 항상 허용
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

// 어떤 경로에서 middleware를 실행할 지 지정 : api, favicon 제외 모든 경로
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
