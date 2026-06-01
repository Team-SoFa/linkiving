import { getJwtExpMs } from '@/lib/auth/jwt';
import { COOKIES_KEYS } from '@/lib/constants/cookies';

export interface AuthTokenData {
  accessToken: string;
  refreshToken?: string;
}

export type TokenResponse =
  | {
      data?: Partial<AuthTokenData> | string;
      accessToken?: string;
      refreshToken?: string;
    }
  | null
  | undefined;

const extractBearerToken = (authorization: string | null) => {
  if (!authorization) return null;

  return authorization.replace(/^Bearer\s+/i, '') || null;
};

const extractCookieToken = (setCookie: string | null, key: string) => {
  if (!setCookie) return null;

  const match = setCookie.match(new RegExp(`(?:^|,\\s*)${key}=([^;,\\s]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

export const extractAuthTokens = (
  response: TokenResponse,
  headers?: Pick<Headers, 'get'>
): AuthTokenData | null => {
  const data = response?.data;
  const accessToken =
    (typeof data === 'string' ? data : data?.accessToken) ??
    response?.accessToken ??
    extractBearerToken(headers?.get('authorization') ?? null) ??
    extractCookieToken(headers?.get('set-cookie') ?? null, COOKIES_KEYS.ACCESS_TOKEN);
  const refreshToken =
    (typeof data === 'string' ? undefined : data?.refreshToken) ??
    response?.refreshToken ??
    extractCookieToken(headers?.get('set-cookie') ?? null, COOKIES_KEYS.REFRESH_TOKEN);

  if (!accessToken) return null;

  return {
    accessToken,
    ...(refreshToken ? { refreshToken } : {}),
  };
};

export const getAuthCookieOptions = (token?: string) => {
  const expMs = token ? getJwtExpMs(token) : null;
  const maxAge = expMs ? Math.max(0, Math.floor((expMs - Date.now()) / 1000)) : undefined;

  return {
    path: '/',
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    ...(maxAge ? { maxAge } : {}),
  };
};
