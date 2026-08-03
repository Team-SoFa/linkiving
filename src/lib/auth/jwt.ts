const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

export type JwtPayload = {
  exp?: number;
  memberStatus?: string;
  status?: string;
  termsAgreed?: boolean;
};

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
};

export const getJwtExpMs = (token: string) => {
  const decodedPayload = decodeJwtPayload(token);
  return decodedPayload?.exp ? decodedPayload.exp * 1000 : null;
};

export const isExpiredJwt = (token: string) => {
  const expMs = getJwtExpMs(token);
  return expMs ? expMs <= Date.now() : true;
};

export const needsTermsAgreement = (token: string) => {
  const payload = decodeJwtPayload(token);
  const memberStatus = payload?.memberStatus ?? payload?.status;

  return memberStatus === 'PENDING_TERMS' || payload?.termsAgreed === false;
};
