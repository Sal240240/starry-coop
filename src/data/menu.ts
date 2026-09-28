/**
 * Starry Coop menu — dine-in prices in CAD.
 *
 * Price provenance (`verified`):
 *   true  → published by the owner (storefront/table posters, Google posts, Google "From the business").
 *   false → derived from the restaurant's own Uber Eats listing ÷ 1.15 (the platform markup).
 *           That conversion matched every owner-published price we could cross-check,
 *           but these should be confirmed by the owner. Set MENU_SHOW_UNVERIFIED_PRICES
 *           to false to show "Ask in store" for them instead. JSON-LD only ever
 *           publishes verified prices.
 *
 * Chinese names (`zh`) appear only where the owner printed them, or where the
 * English name is a direct translation of a standard dish name. Blank otherwise.
 * Descriptions state only what the menu listing or owner says.
 */

export const MENU_SHOW_UNVERIFIED_PRICES = true;

export type MenuTag = 'popular' | 'signature' | 'spicy' | 'veg';

export interface MenuItem {
  name: string;
  zh?: string;
  /** null = no public price */
  price: number | null;
  verified: boolean;
  /** e.g. "10 pcs", "each", "4 pcs" */
  unit?: string;
  description?: string;
  tags?: MenuTag[];
  /** ISO date; shows a "New" badge until this date */
  newUntil?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  zh: string;
  blurb: string;
  items: MenuItem[];
  note?: string;
}

export const MENU_NOTES = {
  prices: 'Dine-in prices in CAD. Prices and availability can change; please confirm with your server.',
  dietary:
    'Please tell us about allergies or dietary needs. Dishes marked “veg” are vegetable-based, but may be prepared with shared sauces, broths or equipment, so do ask.',
  updated: 'September 2026',
};

export const MENU: MenuCategory[] = [
  {
    id: 'skewers-in-pot',
    name: 'Skewers in Pot',
    zh: '冷锅串串香',
    blurb:
      'The dish on our sign. Pick your skewers from the self-serve fridge, then have them BBQ-style or in the pot, and finish at the sauce bar.',
    note: 'Priced per stick, plus the pot base if you choose the pot.',
    items: [
      { name: 'Skewers in Pot, your pick from the fridge', zh: '冷锅串串香', price: 0.58, verified: true, unit: 'per stick', description: 'BBQ-style or in the pot.', tags: ['popular', 'signature'] },
      { name: 'Chicken Broth Chili Oil Pot (base)', price: 2.98, verified: false, tags: ['spicy'] },
    ],
  },
  {
    id: 'noodles-rice',
    name: 'Handmade Noodles & Rice',
    zh: '手工面 · 饭',
    blurb:
      'Our noodles are made by hand in our own kitchen: chewy, fresh and cooked to order. Many bowls are under $10.',
    items: [
      { name: 'Scallion Oil Noodles', zh: '葱油拌面', price: 8.98, verified: true, description: 'Handmade noodles tossed in fragrant scallion oil.', tags: ['popular', 'signature'] },
      { name: 'Spicy Hot Oil Handmade Noodles', zh: '油泼面', price: 9.98, verified: true, tags: ['signature', 'spicy'] },
      { name: '3-in-1 Oil-Spilled Wide Noodles', price: 9.98, verified: false, description: 'Tomato & egg, meat sauce and oil-spilled wide noodles in one bowl.', tags: ['spicy'] },
      { name: 'Taiwanese Braised Beef Noodle Soup', zh: '台湾红烧牛肉面', price: 17.98, verified: false, tags: ['signature'] },
      { name: 'Shredded Chicken & Cucumber Cold Noodles', zh: '鸡丝凉面', price: 11.98, verified: false, description: 'With sweet chili and sesame sauce.' },
      { name: 'Taiwanese Braised Pork Rice', zh: '台湾卤肉饭', price: 8.98, verified: true, tags: ['popular'] },
      { name: 'Cumin Lamb Fried Rice', zh: '孜然羊肉炒饭', price: 21.98, verified: false, description: 'With carrots and onions.' },
      { name: 'Green Onion & Egg Fried Rice with Scallion Oil', price: 16.98, verified: false },
      { name: 'White Rice', zh: '白米饭', price: 1.98, verified: false },
    ],
  },
  {
    id: 'dumplings',
    name: 'Handmade Dumplings & Wontons',
    zh: '纯手工饺子',
    blurb:
      'Made fresh by hand every day with carefully selected ingredients and thin, delicate wrappers. Choose boiled, chili oil, steamed or pan-fried.',
    note: 'Cooking styles: Boiled 水煮 · Chili Oil 油泼 · Steamed 蒸饺 · Pan-Fried 煎饺',
    items: [
      { name: 'Fennel & Pork', zh: '鲜香茴香猪肉', price: 14.98, verified: true, unit: '10 pcs', tags: ['signature'] },
      { name: 'Beef & Celery', zh: '牛肉芹菜', price: 12.98, verified: true, unit: '10 pcs' },
      { name: 'Pickled Cabbage & Pork', zh: '酸菜猪肉', price: 12.98, verified: true, unit: '10 pcs' },
      { name: 'Garlic Chives, Shrimp & Pork', zh: '韭菜虾仁猪肉', price: 12.98, verified: true, unit: '10 pcs' },
      { name: 'Dragon Wontons, Pork & Shrimp', zh: '龙抄手', price: 8.98, verified: false, unit: '6 pcs' },
    ],
  },
  {
    id: 'bbq',
    name: 'BBQ Skewers',
    zh: '烧烤',
    blurb:
      'Grilled to order and priced per skewer. Guests’ favourites: the signature lamb, honey pork belly and pepper chicken cartilage.',
    items: [
      { name: 'Signature Lamb Skewer', zh: '招牌羊肉串', price: 1.98, verified: false, unit: 'each', tags: ['popular', 'signature'] },
      { name: 'Angus Beef Skewer', zh: '安格斯牛肉串', price: 1.98, verified: false, unit: 'each', tags: ['popular'] },
      { name: 'BBQ Honey Pork Belly', zh: '蜜汁五花肉', price: 1.98, verified: false, unit: 'each' },
      { name: 'Pineapple Chicken Skewer', zh: '菠萝鸡肉串', price: 1.98, verified: false, unit: 'each' },
      { name: 'Pepper Chicken Cartilage', zh: '椒盐鸡脆骨', price: 1.98, verified: false, unit: 'each' },
      { name: 'Grilled Squid', zh: '烤鱿鱼', price: 1.98, verified: false, unit: 'each' },
      { name: 'Grilled Shrimp', zh: '烤虾', price: 1.78, verified: false, unit: 'each' },
      { name: 'Grilled Tofu Skin', zh: '烤豆皮', price: 1.78, verified: false, unit: 'each', tags: ['veg'] },
      { name: 'Grilled Cauliflower', zh: '烤花菜', price: 1.78, verified: false, unit: 'each', tags: ['veg'] },
      { name: 'Grilled Chives', zh: '烤韭菜', price: 1.78, verified: false, unit: 'each', tags: ['veg'] },
      { name: 'Grilled Mushroom', zh: '烤蘑菇', price: 1.78, verified: false, unit: 'each', tags: ['veg'] },
      { name: 'Taiwanese Style Sausage', zh: '台式香肠', price: 2.98, verified: true, unit: 'each' },
      { name: 'Grilled Bread with Butter Milk & Creamy Sugar', zh: '烤馒头片', price: 2.98, verified: false, unit: 'each' },
      { name: 'Grilled Eggplant with House Garlic & Soy Sauce', zh: '蒜蓉烤茄子', price: 6.98, verified: false, tags: ['veg'] },
    ],
  },
  {
    id: 'hot-pots',
    name: 'Sharing Hot Pots & Soups',
    zh: '分享锅',
    blurb:
      'Generous pots for the middle of the table, from sizzling green-peppercorn fish to nourishing chicken soups.',
    items: [
      { name: 'Peking Duck, Two Ways', zh: '北京烤鸭', price: 68.88, verified: true, tags: ['signature'], newUntil: '2026-12-31' },
      { name: 'Braised Chicken with Flatbread Pieces (Large)', zh: '大盘鸡', price: 46.98, verified: false, description: 'Chicken, black fungus, mushroom, red pepper and onion.', tags: ['popular'] },
      { name: 'Chongqing Spicy Chicken Hot Pot', price: 36.98, verified: false, tags: ['spicy'] },
      { name: 'Sizzling Green Peppercorn Fish', zh: '藤椒鱼', price: 36.98, verified: false, description: 'Fish fillets, bean sprouts, tofu skin, black fungus, enoki mushrooms and mixed vegetables.', tags: ['spicy'] },
      { name: 'Fresh Coconut Chicken Soup', zh: '椰子鸡', price: 36.98, verified: false },
      { name: 'Golden Pumpkin Chicken Soup', price: 18.98, verified: false },
      { name: 'Matsutake & Wild Mushroom Chicken Soup', price: 18.98, verified: false },
      { name: 'Cordyceps Flower Herbal Chicken Soup', zh: '虫草花鸡汤', price: 16.98, verified: false },
      { name: 'Golden Broth Chicken & Fish Maw Hot Pot', zh: '金汤花胶鸡', price: null, verified: false },
    ],
  },
  {
    id: 'private-kitchen',
    name: 'Private Kitchen Wok Dishes',
    zh: '私房菜',
    blurb:
      'Home-style dishes, freshly cooked to order in the wok. Made for sharing with rice.',
    items: [
      { name: 'Kung Pao Chicken', zh: '宫保鸡丁', price: 19.98, verified: false, tags: ['popular', 'spicy'] },
      { name: 'Braised Boneless Chicken with Wide Noodles', price: 38.98, verified: false, description: 'With mushroom, black fungus and pepper.' },
      { name: 'Beijing-Style Stir-Fried Pork Belly with Green Pepper', price: 24.98, verified: false, tags: ['spicy'] },
      { name: 'Sweet Chili & Sour Sauce Pork', zh: '鱼香肉丝', price: 26.98, verified: false, description: 'With carrots, mushrooms and black fungus.' },
      { name: 'Sweet Chili & Sour Sauce Eggplant with Minced Pork', zh: '鱼香茄子', price: 19.98, verified: false },
      { name: 'Sweet & Sour Chili Chicken', price: 19.98, verified: false },
      { name: 'Kung Pao Tiger Prawns', zh: '宫保大虾', price: 28.98, verified: false, tags: ['spicy'] },
      { name: 'Spicy Stir-Fried Clams', zh: '辣炒花蛤', price: 28.98, verified: false, tags: ['spicy'] },
      { name: 'Braised Noodles with Green Beans & Pork Belly', zh: '豆角焖面', price: 22.98, verified: false },
      { name: 'Cumin Stir-Fried Noodle Slices', zh: '孜然炒面片', price: 19.98, verified: false, description: 'With onion and green vegetables.' },
      { name: 'House Special Fried Rice', price: 22.98, verified: false, description: 'Chicken, shrimp, corn, green beans, mushroom and eggs.' },
      { name: 'Sizzling BBQ Beef with Shaobing', price: null, verified: false, tags: ['signature'] },
    ],
  },
  {
    id: 'home-style',
    name: 'Home-Style Plates',
    zh: '家常菜',
    blurb: 'Comforting classics that round out any table.',
    items: [
      { name: 'Potato, Eggplant & Bell Pepper in Sweet Bean Sauce', zh: '地三鲜', price: 17.98, verified: false, tags: ['veg'] },
      { name: 'Sweet & Chili Fried Cauliflower', price: 17.98, verified: false, tags: ['veg', 'spicy'] },
      { name: 'Sweet & Sour Eggplant', price: 19.98, verified: false, tags: ['veg'] },
      { name: 'Tomato Scrambled Eggs', zh: '番茄炒蛋', price: 17.98, verified: false, tags: ['veg'] },
      { name: 'Spicy Beef Broth with Wide Glass Noodles', price: 9.98, verified: false, description: 'With bean sprouts and tofu skin.', tags: ['spicy'] },
      { name: 'Serrated Fried Potato in Chili Oil & Cumin', zh: '狼牙土豆', price: 6.98, verified: false, tags: ['veg', 'spicy'] },
    ],
  },
  {
    id: 'cold-appetizers',
    name: 'Cold Appetizers',
    zh: '凉菜',
    blurb: 'Bright, crunchy starters to balance the grill.',
    items: [
      { name: 'Seaweed Salad', zh: '凉拌海带丝', price: 4.98, verified: false, tags: ['veg'] },
      { name: 'Chinese Cabbage Salad with Honey Sesame Sauce', price: 6.98, verified: false, tags: ['veg'] },
      { name: 'Starry Road Veggie Salad', price: 7.98, verified: false, description: 'Cucumber, black fungus and fried peanuts with vinaigrette.', tags: ['veg'] },
      { name: 'Lotus Root Salad', zh: '凉拌藕片', price: 7.98, verified: false, description: 'With chili, green pepper and garlic sauce.', tags: ['veg', 'spicy'] },
    ],
  },
  {
    id: 'fried-chicken',
    name: 'Fried Chicken & Snacks',
    zh: '炸鸡 · 小吃',
    blurb:
      'Crispy burgers, wraps, wings and Taiwanese popcorn chicken. Make any fried chicken item a combo with fries and a soft drink.',
    note: 'Combo: any fried chicken item, burger or wrap + fries + soft drink, +$2.50. 任意炸鸡/汉堡/鸡肉卷配薯条+软饮',
    items: [
      { name: 'Chicken Burger, Spicy or Classic', zh: '香辣/麦香鸡腿堡', price: 8.98, verified: true, tags: ['popular'] },
      { name: 'Grilled Chicken Burger', price: 8.98, verified: false },
      { name: 'Fried Chicken Wrap', zh: '老北京鸡肉卷', price: 8.98, verified: true },
      { name: 'Chicken Wings, Spicy or Classic', zh: '麦辣/麦香鸡翅', price: 6.98, verified: true, unit: '4 pcs', tags: ['popular'] },
      { name: 'Taiwanese Popcorn Chicken', zh: '台湾盐酥鸡', price: 13.98, verified: false, description: 'With garlic and onion seasoning.' },
      { name: 'Crispy Fried King Oyster Mushroom', price: 9.98, verified: false, tags: ['veg'] },
      { name: 'Fish & Chips', price: 6.98, verified: false },
      { name: 'French Fries', zh: '炸薯条', price: 4.98, verified: true, tags: ['veg'] },
      { name: 'Combo: Fries + Soft Drink', price: 2.5, verified: true, description: 'Add to any fried chicken item, burger or wrap.' },
    ],
  },
  {
    id: 'drinks',
    name: 'Bubble Tea & Drinks',
    zh: '奶茶 · 饮品',
    blurb:
      'Handcrafted milk teas, fruit teas and smoothies. Coffee and ice cream are free all day.',
    items: [
      { name: 'Brown Sugar Boba Organic Milk', price: 4.98, verified: false, tags: ['popular'] },
      { name: 'Strawberry Fluff Organic Milk', price: 6.98, verified: false },
      { name: 'Mega Juicy Grape', price: 6.98, verified: false },
      { name: 'White Peach Paradise', price: 6.98, verified: false },
      { name: 'Mega Lychee & Jelly', price: 6.98, verified: false },
      { name: 'Sunny Fusion Fruit Tea', price: 7.98, verified: false },
      { name: 'Mango Smoothie with Cream Cap', price: 7.98, verified: false },
      { name: 'Strawberry Smoothie with Cream Cap', price: 7.98, verified: false },
      { name: 'Coffee & Ice Cream', price: 0, verified: true, description: 'Free, all day, from our coffee, ice cream and dessert bar.' },
    ],
  },
];

export function isNew(item: MenuItem, today: Date = new Date()): boolean {
  return item.newUntil !== undefined && today.getTime() < new Date(`${item.newUntil}T23:59:59-08:00`).getTime();
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Ask';
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

/** Display price, honouring the unverified-price switch. */
export function displayPrice(item: MenuItem): string {
  if (item.price === null) return 'Ask';
  if (!item.verified && !MENU_SHOW_UNVERIFIED_PRICES) return 'Ask in store';
  return formatPrice(item.price);
}

/** Lookup by exact English name — throws at build time if a page references a dish that doesn't exist. */
export function findItem(name: string): MenuItem {
  for (const section of MENU) {
    const item = section.items.find((i) => i.name === name);
    if (item) return item;
  }
  throw new Error(`Unknown menu item: ${name}`);
}

export function menuCategory(id: string): MenuCategory {
  const found = MENU.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown menu category: ${id}`);
  return found;
}
