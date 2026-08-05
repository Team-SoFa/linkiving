export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-Q714Z1ZKWF';

const GA_CLIENT_ID_TIMEOUT_MS = 1000;

type Gtag = {
  (command: 'config' | 'event', targetId: string, params?: Record<string, unknown>): void;
  (
    command: 'get',
    targetId: string,
    fieldName: string,
    callback: (value: string | undefined) => void
  ): void;
  (command: 'set', params: Record<string, unknown>): void;
};

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

    try {
      gtag('get', GA_MEASUREMENT_ID, 'client_id', clientId => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        resolve(typeof clientId === 'string' && clientId.trim() ? clientId : null);
      });
    } catch {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(null);
    }
  });
};

export const setGaUserId = (userId: string | null | undefined) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const gtag = window.gtag;
  gtag('set', {
    user_id: userId ?? null,
  });
};

export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', name, params ?? {});
};

export const withAnalyticsContext = async <T extends object>(
  payload: T
): Promise<T & { clientId?: string; source: 'web' }> => {
  const clientId = await getGaClientId().catch(() => null);

  return {
    ...payload,
    ...(clientId ? { clientId } : {}),
    source: 'web',
  };
};
