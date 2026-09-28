export interface NavItem {
  href: string;
  en: string;
  zh: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: '/menu/', en: 'Menu', zh: '菜单' },
  { href: '/menu/skewers-in-pot/', en: 'Skewers', zh: '串串' },
  { href: '/about/', en: 'About', zh: '小馆' },
  { href: '/reviews/', en: 'Reviews', zh: '食评' },
  { href: '/contact/', en: 'Visit', zh: '到访' },
];

export const FOOTER_NAV: { title: string; zh: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Eat',
    zh: '品尝',
    links: [
      { href: '/menu/', label: 'Full menu & prices' },
      { href: '/menu/skewers-in-pot/', label: 'Skewers in pot' },
      { href: '/menu/handmade-noodles-dumplings/', label: 'Handmade noodles & dumplings' },
      { href: '/menu/hot-pots-and-groups/', label: 'Hot pots & groups' },
    ],
  },
  {
    title: 'Plan',
    zh: '预订',
    links: [
      { href: '/booking/', label: 'Reserve a table' },
      { href: '/contact/', label: 'Hours & directions' },
      { href: '/about/', label: 'Our story' },
      { href: '/reviews/', label: 'Guest reviews' },
      { href: '/faq/', label: 'FAQ' },
    ],
  },
];

export const LEGAL_NAV = [
  { href: '/accessibility/', label: 'Accessibility' },
  { href: '/privacy/', label: 'Privacy' },
];

/** Marks the most specific nav item that matches the current path. */
export function currentNavHref(pathname: string, items: NavItem[] = PRIMARY_NAV): string | null {
  const matches = items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length);
  return matches[0]?.href ?? null;
}
