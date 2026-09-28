// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Deployment settings come from environment variables so the same code can
 * build for an Amplify preview branch or the production domain:
 *   SITE_URL                 canonical origin of the live site, e.g. https://www.example.ca
 *                            When unset, the build uses the Amplify branch URL (or localhost)
 *                            and marks every page noindex, so previews never get indexed.
 *   PUBLIC_BOOKING_ENDPOINT  optional HTTPS endpoint for table requests (the AWS Lambda in
 *                            infra/booking-function, or a JSON form service). Unset = phone-first.
 */
const AMPLIFY_BRANCH_URL =
  process.env.AWS_BRANCH && process.env.AWS_APP_ID
    ? `https://${process.env.AWS_BRANCH.replace(/[^a-z0-9-]/gi, '-')}.${process.env.AWS_APP_ID}.amplifyapp.com`
    : undefined;
const SITE_URL = process.env.SITE_URL ?? AMPLIFY_BRANCH_URL ?? 'http://localhost:4321';
const INDEXABLE = Boolean(process.env.SITE_URL) && process.env.PUBLIC_NOINDEX !== 'true';
const BOOKING_ENDPOINT = process.env.PUBLIC_BOOKING_ENDPOINT ?? '';

const bookingOrigin = (() => {
  if (!BOOKING_ENDPOINT) return '';
  try {
    const url = new URL(BOOKING_ENDPOINT);
    if (url.protocol !== 'https:') throw new Error('PUBLIC_BOOKING_ENDPOINT must use https');
    return url.origin;
  } catch (error) {
    throw new Error(`Invalid PUBLIC_BOOKING_ENDPOINT: ${error instanceof Error ? error.message : error}`);
  }
})();

export default defineConfig({
  site: SITE_URL,
  vite: {
    define: {
      __SITE_INDEXABLE__: JSON.stringify(INDEXABLE),
    },
  },
  // Keep Astro's optimized-image cache outside node_modules so Amplify can reuse it (npm ci wipes node_modules).
  cacheDir: './.cache/astro',
  trailingSlash: 'always',
  compressHTML: true,
  markdown: { syntaxHighlight: false },
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    // Explicit widths/sizes are set per image in components/Photo.astro;
    // no responsive-layout helpers, so no inline style attributes (CSP).
    responsiveStyles: false,
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: ['300 600'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
      display: 'swap',
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--font-instrument',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
      display: 'swap',
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !/\/(404|thank-you)\/?$/.test(page),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self'${bookingOrigin ? ` ${bookingOrigin}` : ''}`,
        "frame-src https://www.google.com",
        `form-action 'self'${bookingOrigin ? ` ${bookingOrigin}` : ''}`,
        "manifest-src 'self'",
        "worker-src 'none'",
      ],
    },
  },
});
