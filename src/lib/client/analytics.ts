export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-Q714Z1ZKWF';

const GA_CLIENT_ID_TIMEOUT_MS = 1000;

type Gtag = (
  command: 'config' | 'event' | 'get' | 'set',
  targetId: string,
  fieldOrParams?: string | Record<string, unknown>,
  callback?: (value: string | undefined) => void
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export const getGaClientId = (timeoutMs = GA_CLIENT_ID_TIMEOUT_MS): Promise<string | null> => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    const gtag = window.gtag;
    if (typeof gtag !== 'function') {
      resolve(null);
      return;
    }

    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(null);
    }, timeoutMs);

    gtag('get', GA_MEASUREMENT_ID, 'client_id', clientId => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(typeof clientId === 'string' && clientId.trim() ? clientId : null);
    });
  });
};

export const setGaUserId = (userId: string | null | undefined) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  if (!userId) return;

  const gtag = window.gtag;
  gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });
};

export const withAnalyticsContext = async <T extends object>(
  payload: T
): Promise<T & { clientId?: string; source: 'web' }> => {
  const clientId = await getGaClientId();

  return {
    ...payload,
    ...(clientId ? { clientId } : {}),
    source: 'web',
  };
};
