import * as Sentry from '@sentry/nextjs'

// Get your DSN from https://sentry.io → Project Settings → Client Keys
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,
  integrations: [Sentry.replayIntegration()],
  environment: process.env.NODE_ENV,
  allowUrls: [
    /https:\/\/www\.nexora-academic\.com/,
    /https:\/\/nexora-academic\.com/,
    /https:\/\/www\.nexora-acedamic\.com/,
    /https:\/\/nexora-acedamic\.com/,
    /https:\/\/faceattend\.co\.uk/,
    /https:\/\/www\.faceattend\.co\.uk/,
    /https:\/\/anaai\.tech/,
    /https:\/\/www\.anaai\.tech/,
    /https:\/\/anaaiconsult\.co\.uk/,
    /https:\/\/www\.anaaiconsult\.co\.uk/,
  ],
})
