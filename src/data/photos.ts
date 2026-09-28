/**
 * Photo register. Every image on the site comes from Starry Coop's Google
 * Business Profile, cropped to remove people, TVs, third-party logos and
 * alcohol, with all metadata stripped. `source` is the research ID
 * (research/photos/pXX.jpg). `restricted` photos are never used as a hero
 * and are displayed small (≤ 480 px). See research/FINAL_PLAN.md §4.
 */
import type { ImageMetadata } from 'astro';

import braisedPorkRice from '../assets/photos/braised-pork-rice.jpg';
import chuanChuanCup from '../assets/photos/chuan-chuan-cup.jpg';
import condiments from '../assets/photos/condiments.jpg';
import coralBooths from '../assets/photos/coral-booths.jpg';
import diningRoomMural from '../assets/photos/dining-room-mural.jpg';
import diningRoomSunlit from '../assets/photos/dining-room-sunlit.jpg';
import fruitPopsicles from '../assets/photos/fruit-popsicles.jpg';
import gamesCorner from '../assets/photos/games-corner.jpg';
import grilledEggplant from '../assets/photos/grilled-eggplant.jpg';
import hangingPlanters from '../assets/photos/hanging-planters.jpg';
import lambSkewers from '../assets/photos/lamb-skewers.jpg';
import noodleSpread from '../assets/photos/noodle-spread.jpg';
import handmadeDumplings from '../assets/photos/handmade-dumplings.jpg';
import pandaMural from '../assets/photos/panda-mural.jpg';
import porkBellyBeefSkewers from '../assets/photos/pork-belly-beef-skewers.jpg';
import sauceBar from '../assets/photos/sauce-bar.jpg';
import skewersBambooTray from '../assets/photos/skewers-bamboo-tray.jpg';
import skewersGingham from '../assets/photos/skewers-gingham.jpg';
import skewersLogoTray from '../assets/photos/skewers-logo-tray.jpg';
import steamedDumplings from '../assets/photos/steamed-dumplings.jpg';
import storefrontSign from '../assets/photos/storefront-sign.jpg';
import storefrontStreet from '../assets/photos/storefront-street.jpg';
import wideNoodleSpread from '../assets/photos/wide/noodle-spread.jpg';
import wideChuanChuanCup from '../assets/photos/wide/chuan-chuan-cup.jpg';
import wideHandmadeDumplings from '../assets/photos/wide/handmade-dumplings.jpg';
import wideSkewersBambooTray from '../assets/photos/wide/skewers-bamboo-tray.jpg';
import wideSkewersLogoTray from '../assets/photos/wide/skewers-logo-tray.jpg';
import sunroomBooth from '../assets/photos/sunroom-booth.jpg';
import sunroomSkylight from '../assets/photos/sunroom-skylight.jpg';

export interface Photo {
  src: ImageMetadata;
  /** Landscape crop used for full-bleed heroes on wider screens (art direction). */
  wide?: ImageMetadata;
  alt: string;
  source: string;
  restricted?: boolean;
}

export const PHOTOS = {
  'noodle-spread': {
    wide: wideNoodleSpread,
    src: noodleSpread,
    alt: 'Scallion oil noodles topped with charred scallion and sesame, with braised pork rice and soup behind',
    source: 'p05',
  },
  'braised-pork-rice': {
    src: braisedPorkRice,
    alt: 'Taiwanese braised pork rice with a marinated egg and pickled greens on a pink terrazzo table',
    source: 'p16',
  },
  'lamb-skewers': {
    src: lambSkewers,
    alt: 'Spiced signature lamb skewers on red gingham paper on a bamboo tray',
    source: 'p23',
  },
  'pork-belly-beef-skewers': {
    src: porkBellyBeefSkewers,
    alt: 'Glazed honey pork belly and Angus beef skewers on a bamboo tray',
    source: 'p20',
  },
  'chuan-chuan-cup': {
    wide: wideChuanChuanCup,
    src: chuanChuanCup,
    alt: 'Skewers standing in an enamel pot of chili-oil broth, with edamame and dipping sauces in brass bowls',
    source: 'p17',
  },
  'sauce-bar': {
    src: sauceBar,
    alt: 'The self-serve sauce bar with its “Popular Sauce Mixes” board and stacked brass bowls',
    source: 'p08',
    restricted: true,
  },
  'handmade-dumplings': {
    wide: wideHandmadeDumplings,
    src: handmadeDumplings,
    alt: 'Handmade dumplings with sesame and chili oil on a blue-and-white plate',
    source: 'p25',
  },
  'steamed-dumplings': {
    src: steamedDumplings,
    alt: 'Dumplings steaming in a bamboo basket, with grilled skewers behind',
    source: 'p19',
  },
  'dining-room-mural': {
    src: diningRoomMural,
    alt: 'The hand-painted “Lovely Day in West Van” mural beneath trailing vines and string lights',
    source: 'p13 (cropped)',
  },
  'coral-booths': {
    src: coralBooths,
    alt: 'Curved coral-red booths beneath pink neon Chinese signs',
    source: 'p29',
  },
  'fruit-popsicles': {
    src: fruitPopsicles,
    alt: 'Fruit ice pops from the free dessert bar on a terrazzo table',
    source: 'p14',
    restricted: true,
  },
  'storefront-sign': {
    src: storefrontSign,
    alt: 'The pink “Starry Coop — Skewer in Pot” sign and paper lanterns above Marine Drive',
    source: 'p01 (cropped)',
  },
  'storefront-street': {
    src: storefrontStreet,
    alt: 'The street entrance on Marine Drive with the Starry Coop sign and the skewers-in-pot poster',
    source: 'p01 (cropped)',
  },
  'skewers-gingham': {
    src: skewersGingham,
    alt: 'A loaded tray of assorted BBQ skewers on red gingham paper',
    source: 'p07',
  },
  'grilled-eggplant': {
    src: grilledEggplant,
    alt: 'Grilled eggplant with garlic, chili, green onion and sesame on gingham paper',
    source: 'p26 (cropped)',
  },
  'panda-mural': {
    src: pandaMural,
    alt: 'A mural of a panda holding a skewer beside a steaming hot pot',
    source: 'p28',
  },
  'skewers-bamboo-tray': {
    wide: wideSkewersBambooTray,
    src: skewersBambooTray,
    alt: 'Grilled skewers on a bamboo tray stamped with the Starry Coop moon logo',
    source: 'p21',
  },
  'skewers-logo-tray': {
    wide: wideSkewersLogoTray,
    src: skewersLogoTray,
    alt: 'Two skewers on a wooden tray beside the moon-and-star Starry Coop stamp',
    source: 'p22',
  },
  condiments: {
    src: condiments,
    alt: 'Dessert jelly with mango syrup beside bowls of house condiments',
    source: 'p15',
    restricted: true,
  },
  'sunroom-skylight': {
    src: sunroomSkylight,
    alt: 'Rope planters and trailing vines under the sunroom’s glass roof',
    source: 'p02 (cropped)',
    restricted: true,
  },
  'sunroom-booth': {
    src: sunroomBooth,
    alt: 'A curved coral booth and terrazzo table in the sunroom',
    source: 'p02 (cropped)',
    restricted: true,
  },
  'hanging-planters': {
    src: hangingPlanters,
    alt: 'Woven planters hanging along the sunlit conservatory roof',
    source: 'p30 (cropped)',
  },
  'dining-room-sunlit': {
    src: diningRoomSunlit,
    alt: 'The sunlit dining room with orange chairs and terrazzo tables',
    source: 'p30 (cropped)',
  },
  'games-corner': {
    src: gamesCorner,
    alt: 'A reading and games corner stocked with board games for families',
    source: 'p31',
  },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const photo = (key: PhotoKey): Photo => PHOTOS[key];
