/// <reference types="astro/client" />

/** True only when SITE_URL is set for the production domain (see astro.config.mjs). */
declare const __SITE_INDEXABLE__: boolean;

interface ImportMetaEnv {
  readonly PUBLIC_BOOKING_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
