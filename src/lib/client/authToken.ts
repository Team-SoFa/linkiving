import { isExpiredJwt } from '@/lib/auth/jwt';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { getAccessToken } from '@/stores/tokenStore';

const getCookie = (key: string) => {
  if (typeof document === 'undefined') return null;

  const tokenEntry = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
  return tokenEntry ? decodeURIComponent(tokenEntry.substring(`${key}=`.length)) : null;
};

export const getClientAccessToken = () => {
  const token = getCookie(COOKIES_KEYS.ACCESS_TOKEN) || getAccessToken();

  if (!token || isExpiredJwt(token)) return null;

  return token;
};

export const getClientAuthorization = () => {
  const token = getClientAccessToken();
  return token ? `Bearer ${token}` : null;
};
