/**
 * SEO registry: one row per page. Pages read their <title>, meta description
 * and H1 from here, and pages.test.ts enforces lengths and uniqueness so no two
 * pages compete for the same query. Primary keywords are documented for editors.
 */
import type { PhotoKey } from './photos';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  ogPhoto: PhotoKey;
  noindex?: boolean;
}

export const PAGES = {
  home: {
    path: '/',
    title: 'Starry Coop 星月小馆 · Chinese & Taiwanese, West Vancouver',
    description:
      'Skewers in pot from $0.58 a stick, handmade noodles and dumplings, and Taiwanese beef noodle soup, upstairs at 1373 Marine Dr, Ambleside, West Vancouver.',
    h1: 'Starry Coop 星月小馆 · West Vancouver. A hidden kitchen, upstairs on Marine Drive.',
    keywords: ['chinese restaurant west vancouver', 'taiwanese food west vancouver', 'ambleside restaurant', '西温 中餐'],
    ogPhoto: 'noodle-spread',
  },
  menu: {
    path: '/menu/',
    title: 'Menu & Prices · Starry Coop 星月小馆, West Vancouver',
    description:
      'Full menu with dine-in prices: handmade noodles from $8.98, dumplings, skewers from $0.58 a stick, sharing hot pots, Peking duck, wok dishes and bubble tea.',
    h1: 'Menu 菜单',
    keywords: ['starry coop menu', 'chinese food menu west vancouver', 'taiwanese menu north shore'],
    ogPhoto: 'braised-pork-rice',
  },
  skewers: {
    path: '/menu/skewers-in-pot/',
    title: 'Skewers in Pot 冷锅串串香 · $0.58 a Stick · Starry Coop',
    description:
      'Pick skewers from our self-serve fridge at $0.58 a stick, then have them grilled BBQ-style or in chili-oil broth ($2.98 pot base). Lamb and Angus $1.98.',
    h1: 'Skewers in Pot 冷锅串串香, $0.58 a stick',
    keywords: ['skewers west vancouver', 'chuan chuan vancouver', '串串香 西温', 'lamb skewers north shore'],
    ogPhoto: 'chuan-chuan-cup',
  },
  handmade: {
    path: '/menu/handmade-noodles-dumplings/',
    title: 'Handmade Dumplings & Noodles in West Vancouver · Starry Coop',
    description:
      'Dumplings folded by hand every day, boiled, steamed, pan-fried or in chili oil, plus scallion oil and spicy hot-oil noodles made in our kitchen. From $8.98.',
    h1: 'Handmade noodles & dumplings in West Vancouver',
    keywords: ['handmade dumplings west vancouver', 'handmade noodles north shore', '手工饺子 西温'],
    ogPhoto: 'handmade-dumplings',
  },
  groups: {
    path: '/menu/hot-pots-and-groups/',
    title: 'Hot Pots, Peking Duck & Group Dining · Starry Coop',
    description:
      'Big plate chicken, Chongqing spicy chicken, green peppercorn fish, coconut chicken soup and Peking Duck Two Ways ($68.88), made for sharing in West Vancouver.',
    h1: 'Sharing hot pots, Peking duck & group dining',
    keywords: ['hot pot west vancouver', 'peking duck west vancouver', 'group dinner ambleside'],
    ogPhoto: 'coral-booths',
  },
  about: {
    path: '/about/',
    title: 'About Our Hidden Kitchen · Starry Coop, West Vancouver',
    description:
      'A women-owned, LGBTQ+ friendly kitchen upstairs on Marine Drive, serving made-to-order Chinese and Taiwanese comfort food in a bright room full of murals.',
    h1: 'Our owner-chef’s hidden kitchen',
    keywords: ['women-owned restaurant west vancouver', 'family friendly restaurant ambleside'],
    ogPhoto: 'dining-room-mural',
  },
  reviews: {
    path: '/reviews/',
    title: 'Guest Reviews · 4.9★ on Google · Starry Coop West Vancouver',
    description:
      'Read what guests say about our handmade noodles, dumplings, skewers and Taiwanese beef noodle soup, in their own words from our Google reviews.',
    h1: 'What our guests say',
    keywords: ['starry coop reviews', 'west vancouver restaurant reviews'],
    ogPhoto: 'skewers-bamboo-tray',
  },
  booking: {
    path: '/booking/',
    title: 'Reserve a Table · Starry Coop 星月小馆, West Vancouver',
    description:
      'Request a table at Starry Coop in under a minute and we’ll call to confirm, or phone us at (604) 281-1888. Upstairs at 1373 Marine Dr, West Vancouver.',
    h1: 'Reserve a table 预订',
    keywords: ['reserve table west vancouver', 'chinese restaurant reservation west vancouver'],
    ogPhoto: 'skewers-logo-tray',
  },
  contact: {
    path: '/contact/',
    title: 'Hours & Directions · Starry Coop, 1373 Marine Dr, West Van',
    description:
      'Open daily from 11 a.m.: Monday to Thursday until 9 p.m., Friday to Sunday until 9:30 p.m. Upstairs at 1373 Marine Dr, a short walk from Ambleside Beach.',
    h1: 'Hours, directions & contact',
    keywords: ['starry coop hours', 'restaurants marine drive west vancouver', 'ambleside restaurants'],
    ogPhoto: 'dining-room-sunlit',
  },
  faq: {
    path: '/faq/',
    title: 'FAQ · Reservations, Vegan Options & Kids · Starry Coop',
    description:
      'Answers about reservations, skewers in pot, vegan options, kids, free coffee and ice cream, takeout and delivery, and finding us upstairs on Marine Drive.',
    h1: 'Frequently asked questions',
    keywords: ['vegan options west vancouver chinese', 'kid friendly restaurant ambleside'],
    ogPhoto: 'games-corner',
  },
  accessibility: {
    path: '/accessibility/',
    title: 'Accessibility · Starry Coop, West Vancouver',
    description:
      'How to reach our second-floor dining room, what to expect at the entrance, and our commitment to an accessible website. Questions? Call (604) 281-1888.',
    h1: 'Accessibility',
    keywords: [],
    ogPhoto: 'storefront-street',
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy Policy · Starry Coop 星月小馆',
    description:
      'How Starry Coop collects, uses and protects personal information from table requests and phone calls, in line with BC’s Personal Information Protection Act.',
    h1: 'Privacy policy',
    keywords: [],
    ogPhoto: 'storefront-sign',
  },
  notFound: {
    path: '/404/',
    title: 'Page Not Found · Starry Coop 星月小馆, West Vancouver',
    description:
      'Sorry, this page melted away. Head back to the Starry Coop menu, reserve a table, or find us upstairs at 1373 Marine Drive in West Vancouver.',
    h1: 'This page melted.',
    keywords: [],
    ogPhoto: 'fruit-popsicles',
    noindex: true,
  },
} as const satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof PAGES;
