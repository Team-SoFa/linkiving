'use client';

type Gtag = {
  (command: 'set', params: Record<string, unknown>): void;
  (command: 'event', eventName: string, params?: Record<string, unknown>): void;
};

type GtagCommand = ['set', Record<string, unknown>] | ['event', string, Record<string, unknown>];

const getGtag = (): Gtag | null => {
  if (typeof window === 'undefined') return null;

  const gtag = (window as { gtag?: unknown }).gtag;
  return typeof gtag === 'function' ? (gtag as Gtag) : null;
};

export const trackGoogleSignUp = (userId?: string | null) => {
  const analyticsUserId = userId?.trim();
  if (!analyticsUserId) return;

  const setUserIdCommand: GtagCommand = ['set', { user_id: analyticsUserId }];
  const signUpCommand: GtagCommand = ['event', 'sign_up', { method: 'google' }];
  const gtag = getGtag();

  if (!gtag) {
    if (typeof window !== 'undefined') {
      const analyticsWindow = window as { dataLayer?: GtagCommand[] };
      analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
      analyticsWindow.dataLayer.push(setUserIdCommand, signUpCommand);
    }
    return;
  }

  gtag('set', { user_id: analyticsUserId });
  gtag('event', 'sign_up', { method: 'google' });
};
