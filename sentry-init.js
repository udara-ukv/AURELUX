// sentry-init.js - Initialize Sentry for error tracking and performance monitoring
// Replace 'YOUR_SENTRY_DSN' with your actual Sentry DSN from https://sentry.io

if (typeof window !== 'undefined') {
  // Load Sentry SDK
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/7.91.0/bundle.min.js';
  script.async = true;
  
  script.onload = function() {
    if (window.Sentry) {
      window.Sentry.init({
        dsn: 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID',
        environment: 'production',
        tracesSampleRate: 0.1,
        integrations: [new window.Sentry.Replay({ maskAllText: true, blockAllMedia: true })],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
      console.log('✅ Sentry initialized for error tracking');
    }
  };
  
  document.head.appendChild(script);
}
