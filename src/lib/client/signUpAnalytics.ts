'use client';

type Gtag = {
  (command: 'set', params: Record<string, unknown>): void;
  (command: 'event', eventName: string, params?: Record<string, unknown>): void;
};

const getGtag = (): Gtag | null => {
  if (typeof window === 'undefined') return null;

  const gtag = (window as { gtag?: unknown }).gtag;
  return typeof gtag === 'function' ? (gtag as Gtag) : null;
};

export const trackGoogleSignUp = (userId?: string | null) => {
  const gtag = getGtag();
  if (!gtag) return;

  if (userId) {
    gtag('set', { user_id: userId });
  }
  gtag('event', 'sign_up', { method: 'google' });
};
