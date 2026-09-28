/**
 * schema.org JSON-LD builders. Deliberately conservative: only facts the
 * owner has published appear as machine-readable claims.
 *  - No Review/AggregateRating (first-party review markup is "self-serving"
 *    for a LocalBusiness and ineligible for rich results).
 *  - Menu offers include owner-verified prices only.
 *  - No dietary or amenity claims.
 */
import { SITE } from '../data/site';
import { MENU } from '../data/menu';

type JsonLd = Record<string, unknown>;

const DAY_NAMES: Record<string, string> = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
};

export const restaurantId = (origin: string): string => `${origin}/#restaurant`;

export function restaurantSchema(origin: string, imageUrls: string[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': restaurantId(origin),
    name: `${SITE.name} ${SITE.nameZh}`,
    alternateName: [SITE.name, SITE.nameZh],
    description: SITE.description,
    url: `${origin}/`,
    telephone: SITE.phone.e164,
    image: imageUrls,
    priceRange: SITE.priceLevel,
    servesCuisine: [...SITE.cuisines],
    acceptsReservations: SITE.booking.acceptsReservations,
    hasMenu: `${origin}/menu/`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.links.googleMaps,
    openingHoursSpecification: SITE.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => DAY_NAMES[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [SITE.links.googleMaps, SITE.links.uberEats],
  };
}

export function menuSchema(origin: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${origin}/menu/#menu`,
    name: `${SITE.name} Menu`,
    inLanguage: 'en-CA',
    url: `${origin}/menu/`,
    hasMenuSection: MENU.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      description: section.blurb,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.verified && item.price !== null && item.price > 0
          ? { offers: { '@type': 'Offer', price: item.price.toFixed(2), priceCurrency: 'CAD' } }
          : {}),
      })),
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(origin: string, crumbs: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${origin}${c.path}`,
    })),
  };
}

export interface Faq {
  q: string;
  a: string;
}

export function faqSchema(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function webPageSchema(origin: string, path: string, title: string, description: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${origin}${path}#webpage`,
    url: `${origin}${path}`,
    name: title,
    description,
    inLanguage: 'en-CA',
    isPartOf: { '@type': 'WebSite', '@id': `${origin}/#website`, name: SITE.name, url: `${origin}/` },
    about: { '@id': restaurantId(origin) },
  };
}
