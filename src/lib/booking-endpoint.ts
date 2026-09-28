/**
 * Build-time booking configuration (Astro only — not imported by the Lambda).
 * Online table requests are enabled when PUBLIC_BOOKING_ENDPOINT is set;
 * otherwise the site runs in phone-first mode.
 */
export const BOOKING_ENDPOINT: string = import.meta.env.PUBLIC_BOOKING_ENDPOINT ?? '';
export const ONLINE_BOOKING = BOOKING_ENDPOINT.startsWith('https://');
