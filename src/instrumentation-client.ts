// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://c070e7879d20fcd2397c7328d07aaf22@o4510933659287552.ingest.us.sentry.io/4511022631813120',

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1, // TODO: 배포 시 값 낮춰야 함
  // Enable logs to be sent to Sentry
  enableLogs: true, // TODO: 로그 수집 추후 비활성화 필요

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true, // TODO: IP 주소 및 사용자 정보 자동 수집으로, 배포 시 삭제 or 개인정보 동의 필요
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
