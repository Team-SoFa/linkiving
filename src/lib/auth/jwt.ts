const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

export const getJwtExpMs = (token: string) => {
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    const decodedPayload = JSON.parse(decodeBase64Url(payload)) as { exp?: number };
    return decodedPayload.exp ? decodedPayload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isExpiredJwt = (token: string) => {
  const expMs = getJwtExpMs(token);
  return expMs ? expMs <= Date.now() : true;
};
