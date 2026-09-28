/**
 * Single source of truth for business details.
 * Update here and every page, footer, and JSON-LD block follows.
 */

export type DayKey = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

export interface OpeningHours {
  /** Schema.org day codes this row applies to */
  days: DayKey[];
  label: string;
  short: string;
  /** 24h "HH:MM" local time (America/Vancouver) */
  opens: string;
  closes: string;
}

export const SITE = {
  name: 'Starry Coop',
  nameZh: '星月小馆',
  tagline: 'Handmade noodles, dumplings & BBQ skewers in Ambleside',
  description:
    'Starry Coop 星月小馆 is a women-owned Chinese & Taiwanese kitchen upstairs on Marine Drive in West Vancouver — handmade noodles and dumplings, grilled BBQ skewers, sharing hot pots and bubble tea, made fresh to order.',
  locale: 'en-CA',
  timezone: 'America/Vancouver',

  phone: {
    display: '(604) 281-1888',
    e164: '+16042811888',
    /** Set true once the owner confirms this number can receive text messages. */
    acceptsSms: false,
  },

  address: {
    street: '1373 Marine Drive, 2nd Floor',
    city: 'West Vancouver',
    region: 'BC',
    postalCode: 'V7T 1B6',
    country: 'CA',
    neighbourhood: 'Ambleside',
  },

  geo: { lat: 49.3279271, lng: -123.153559 },

  links: {
    googleMaps: 'https://maps.google.com/?cid=11185278939843817932',
    googleReviews: 'https://maps.google.com/?cid=11185278939843817932',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Starry+Coop+1373+Marine+Dr+West+Vancouver+BC',
    uberEats:
      'https://www.ubereats.com/ca/store/starry-coop-%E6%98%9F%E6%9C%88%E5%B0%8F%E9%A6%86/dsPWnsrKXmCSB7zkI-1mnQ',
  },

  rating: {
    value: 4.9,
    count: 277,
    source: 'Google',
    asOf: 'September 2026',
  },

  priceRange: '$20–30 per person',
  priceLevel: '$$',

  hours: [
    { days: ['Mo', 'Tu', 'We', 'Th'], label: 'Monday – Thursday', short: 'Mon–Thu', opens: '11:00', closes: '21:00' },
    { days: ['Fr', 'Sa', 'Su'], label: 'Friday – Sunday', short: 'Fri–Sun', opens: '11:00', closes: '21:30' },
  ] satisfies OpeningHours[],

  cuisines: ['Chinese', 'Taiwanese', 'Sichuan'],

  /** Attributes as listed on the Google Business Profile (shown with a footnote). */
  googleAttributes: ['Women-owned', 'LGBTQ+ friendly', 'Vegan options', 'Happy hour food', 'Good for watching sports'],

  booking: {
    /** Owner to confirm. Drives the Restaurant JSON-LD and booking copy. Online
        requests are enabled separately by PUBLIC_BOOKING_ENDPOINT (see lib/booking-endpoint.ts). */
    acceptsReservations: true,
  },
} as const;

export const telHref = `tel:${SITE.phone.e164}`;

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

/** Formats "21:30" as "9:30 p.m." (Canadian style) */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'p.m.' : 'a.m.';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}
