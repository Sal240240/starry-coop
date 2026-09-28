/**
 * Guest reviews quoted from Starry Coop's public Google Business Profile (all 5★).
 * Wording is verbatim (see review-sources.ts). "…" marks omitted text: names
 * of staff and the owner, and other asides, are left out. Reviewer names are
 * shown as first name + initial where Google displayed them.
 * reviews.test.ts enforces that every excerpt is an exact substring of its source.
 */

export type ReviewTopic =
  | 'noodles'
  | 'dumplings'
  | 'skewers'
  | 'hot-pot'
  | 'fried-chicken'
  | 'family'
  | 'atmosphere'
  | 'value'
  | 'service'
  | 'location';

export interface Review {
  id: string;
  author: string;
  /** Short pull-quote for cards and inline quotes (verbatim). */
  quote: string;
  /** Longer excerpt for the Reviews page (verbatim segments joined by "…"). */
  text: string;
  topics: ReviewTopic[];
  lang?: 'zh-Hans';
  /** Our English translation, shown labelled as such (zh reviews only). */
  translation?: string;
  quoteTranslation?: string;
}

export const REVIEWS: Review[] = [
  {
    id: 'andrea',
    author: 'Andréa',
    quote: 'together with her hand-made sauces and ground spices for adding to amazing flavours of marinated meats and delicious broths!!!',
    text: 'This is, by far, my new, favourite Asian Restaurant, in the whole lower mainland!! … this darling, talented Owner-Chef, … brings home-made, noodles and dumplings and wontons to a whole new boutique level of awesomeness, together with her hand-made sauces and ground spices for adding to amazing flavours of marinated meats and delicious broths!!!',
    topics: ['noodles', 'dumplings', 'service'],
  },
  {
    id: 'hidden-gem-noodles',
    author: 'Google reviewer',
    quote: 'The handmade noodles were definitely the highlight. They were chewy, fresh, and you can really tell they’re made with care.',
    text: 'Absolutely love this little hidden gem in West Vancouver! ❤️ We tried the stir-fried pork with onion and wood ear mushrooms, Spicy Hot Oil Noodles with Tomato & Egg and braised pork, and the Braised Noodles. Everything was cooked really well — great flavor, great texture, and the heat was just right. The handmade noodles were definitely the highlight. They were chewy, fresh, and you can really tell they’re made with care. It’s honestly not easy to find a restaurant in West Van that puts this much effort into comforting Asian food.',
    topics: ['noodles', 'atmosphere'],
  },
  {
    id: 'angelica',
    author: 'Angelica B.',
    quote: "They have an amazing array of food (hotpot, BBQ skewers, dumplings, snacks, etc) and it's all made with such care!",
    text: 'I can\'t believe I didn\'t know about this place as soon as it opened! We came in for a quick snacks after a walk and ended up staying for so long lol. They have an amazing array of food (hotpot, BBQ skewers, dumplings, snacks, etc) and it\'s all made with such care! … Their dumplings and meat skewers were my favourite!!! … The service was wonderful, they were so kind and helped us out when we weren\'t sure how to go about the menu and the price is amazing for the kind of quality you get! Their decor is also so adorable, props to whoever set it all up.',
    topics: ['skewers', 'dumplings', 'atmosphere', 'service'],
  },
  {
    id: 'skewers-world',
    author: 'Google reviewer',
    quote: 'I\'ve eaten skewers from all over the world and this is my new top spot!!',
    text: 'This place is amazing!! I\'ve eaten skewers from all over the world and this is my new top spot!! I had the lamb, honey pork belly, and chicken cartilage. All really good!! Even the sides like the scallion noodles, chicken wings and dumplings were some of the best I\'ve had in general.',
    topics: ['skewers', 'noodles', 'dumplings'],
  },
  {
    id: 'ambleside-walk',
    author: 'Google reviewer',
    quote: 'It\'s also just a short walk to Ambleside Beach, making it the perfect spot for a meal before or after a stroll.',
    text: 'A hidden gem in West Vancouver! Located right on Marine Drive on the 2nd floor, this new spot offers incredible food at very reasonable prices, especially considering Vancouver\'s high cost of living. You can taste the chef\'s dedication in every dish, the 100% handmade noodles have an amazing chewy texture, and all the sauces are made from scratch. The Scallion Oil Noodle ($8.98~) and Taiwanese Braised Beef Noodle Soup were absolute highlights, and the skewers ($0.58 each) are such a fun, tasty bargain! The interior is clean, spacious, and filled with cute wall art. It\'s also just a short walk to Ambleside Beach, making it the perfect spot for a meal before or after a stroll.',
    topics: ['noodles', 'skewers', 'value', 'location', 'atmosphere'],
  },
  {
    id: 'beef-noodle-taiwan',
    author: 'Google reviewer',
    quote: 'Beef noodle soup is super yummy! The taste is the same as I’ve had before in Taiwan',
    text: 'Beef noodle soup is super yummy! The taste is the same as I’ve had before in Taiwan, and it pleasantly surprised me. I am from Montreal, and I will definitely return the next time I get the chance.',
    topics: ['noodles'],
  },
  {
    id: 'kung-pao',
    author: 'Google reviewer',
    quote: 'Everything we ordered was freshly cooked to order, with great wok hei and lots of flavor.',
    text: 'The Kung Pao Chicken here is seriously delicious! Everything we ordered was freshly cooked to order, with great wok hei and lots of flavor. The prices are also very reasonable, especially for West Vancouver — it’s honestly hard to find another place like this around here. What I love most is the hidden-kitchen vibe. It feels a little tucked away, quiet and private, with a relaxed and chill atmosphere. My whole family really enjoys coming here.',
    topics: ['value', 'atmosphere', 'family'],
  },
  {
    id: 'big-plate-chicken',
    author: 'Google reviewer',
    quote: 'Everything is freshly cut and cooked to order—definitely not pre-made.',
    text: 'Everything is freshly cut and cooked to order—definitely not pre-made. The noodles in the Big Plate Chicken were full of flavor, and the chicken was tender and delicious. The braised pork rice was also excellent: every grain of rice was firm and perfectly cooked, and the sauce tasted truly authentic. The restaurant was spotless, warm, and inviting. The afternoon sunlight streaming in made the whole space feel especially cozy and relaxing.',
    topics: ['hot-pot', 'noodles', 'atmosphere'],
  },
  {
    id: 'mom-fresh',
    author: 'Google reviewer',
    quote: 'The food was spectacular—fresh, delicious, and made from scratch by them.',
    text: 'Today was our first time having dinner here with our family, and honestly, we were absolutely delighted! ❤️ The food was spectacular—fresh, delicious, and made from scratch by them. You can truly taste the quality, freshness, and care in every bite. … As a mom, it’s very important to me to find places where my kids can enjoy food that is not only delicious but also fresh and healthy, and this place exceeded our expectations.',
    topics: ['family'],
  },
  {
    id: 'baby-toy',
    author: 'Google reviewer',
    quote: '… owner is very welcoming, and even gave our baby a small toy.',
    text: 'Had an amazing experience dining here with our 7 month old baby, owner is very welcoming, and even gave our baby a small toy. The food was also freshly made with great quality and price is also reasonable. We especially enjoyed the combo set the owner recommended.',
    topics: ['family', 'service', 'value'],
  },
  {
    id: 'value-portions',
    author: 'Google reviewer',
    quote: 'A lot of the rice and noodle dishes are under $10, and the portions are surprisingly big',
    text: 'Hidden gem in West Van! 💛 Honestly didn’t expect the food to be this good. … The scallion oil noodles were super fragrant and flavorful, and the fried chicken burger was SO good, so crispy, juicy and really fresh. … A lot of the rice and noodle dishes are under $10, and the portions are surprisingly big, which makes this such a great spot for a quick and affordable meal, especially for students and working people. … The space is bright, cute and comfortable, with a really nice casual atmosphere. For West Van, the value is seriously hard to beat.',
    topics: ['value', 'noodles', 'fried-chicken', 'atmosphere'],
  },
  {
    id: 'welcoming',
    author: 'Google reviewer',
    quote: 'Great food, friendly service, good portions, and a welcoming atmosphere.',
    text: 'From the moment we arrived, the staff were friendly, welcoming, and attentive. The food came out fresh and everything we ordered was full of flavor and cooked perfectly. You can really tell they put a lot of care into their dishes. The portions were generous, the presentation was nice, and the authentic Chinese flavors definitely did not disappoint. The restaurant itself had a comfortable and inviting atmosphere, making it a great place to enjoy a meal with family or friends. … Great food, friendly service, good portions, and a welcoming atmosphere.',
    topics: ['service', 'atmosphere', 'family'],
  },
  {
    id: 'patitta',
    author: 'Patitta J.',
    quote: 'My favorite restaurant so far!!!',
    text: 'My favorite restaurant so far!!!. Everything I have ordered is delicious. Price also good also atmosphere is quite nice. good place to hangout with friends they provide free drinks(coffee, tea), dessert, ice cream. Staff also nice!',
    topics: ['value', 'atmosphere', 'service'],
  },
  {
    id: 'heaven',
    author: 'Google reviewer',
    quote: 'The food is heaven and I barely need to think about what to order, because they\'re all really good.',
    text: 'It\'s cozy, it\'s the perfect amount for price. The food is heaven and I barely need to think about what to order, because they\'re all really good.',
    topics: ['value', 'atmosphere'],
  },
  {
    id: 'wings',
    author: 'Google reviewer',
    quote: 'Super great fried chicken wings!',
    text: 'Super great fried chicken wings! … Unlike a lot of other places the chicken was still perfectly crispy even after transiting, and it wasn’t too salty either',
    topics: ['fried-chicken'],
  },
  {
    id: 'authentic-dumplings',
    author: 'Google reviewer',
    quote: 'The dumplings are actually really authentic, unlike the frozen ones.',
    text: 'Went there today for lunch. The food is really good, one of the unique places in Vancouver! The dumplings are actually really authentic, unlike the frozen ones. The staff is very nice! I would certainly come back!',
    topics: ['dumplings', 'service'],
  },
  {
    id: 'couple',
    author: 'Google reviewer',
    quote: 'Everything was delicious, the portion sizes were good, and the value for your money was really good.',
    text: 'My wife and I ate here a couple of days ago. We ordered a few of the lamb and pork belly skewers, the fried rice, and the scallion noodles. Everything was delicious, the portion sizes were good, and the value for your money was really good. The restaurant itself is also pretty cute.',
    topics: ['skewers', 'noodles', 'value'],
  },
  {
    id: 'marc',
    author: 'Marc N.',
    quote: 'Good food, good service.',
    text: 'Good food, good service. Great place to get skewers noodles, rice, etc. Please come and support them. They\'re so kind and food is good',
    topics: ['skewers', 'service'],
  },
  {
    id: 'happy-hour',
    author: 'Google reviewer',
    quote: 'What a great price and so fresh.',
    text: 'So happy I found this new restaurant. … What a great price and so fresh. The owner and staff were welcoming, and i can\'t wait to go back to try the noodles.',
    topics: ['value', 'service'],
  },
  {
    id: 'bbq-burger',
    author: 'Google reviewer',
    quote: 'So great BBQ and Fried chicken burger Nice staff here Will be every week',
    text: 'So great BBQ and Fried chicken burger Nice staff here Will be every week',
    topics: ['skewers', 'fried-chicken', 'service'],
  },
  {
    id: 'zh-family',
    author: 'Google 评论',
    quote: '炒菜有锅气，锅物热气腾腾，面点做得扎实，串串香够味',
    quoteTranslation:
      'The stir-fries have real wok hei, the pots arrive steaming hot, the noodles and dumplings are hearty, and the skewers-in-pot are full of flavour.',
    text: '现在能找到一家价格亲民、味道在线、选择还特别丰富的餐厅，真的很难得。炒菜有锅气，锅物热气腾腾，面点做得扎实，串串香够味，烧烤也是一上桌就忍不住继续加单；… 最难得的是一家人来吃，不管老人、孩子还是年轻人，都能吃得特别满足。… 价格不贵，品质却一点不含糊，难怪我们家连续两个星期都来',
    translation:
      'It’s rare these days to find a restaurant with friendly prices, reliable flavour and so much choice. The stir-fries have real wok hei, the pots arrive steaming hot, the noodles and dumplings are hearty, the skewers-in-pot are full of flavour, and once the BBQ hits the table you can’t help ordering more… Best of all, the whole family comes away satisfied, whether grandparents, kids or young people… The prices aren’t high, yet the quality never slips. No wonder our family came back two weeks in a row.',
    topics: ['family', 'value', 'hot-pot', 'skewers'],
    lang: 'zh-Hans',
  },
];

export function reviewsByTopic(topic: ReviewTopic, limit = 3): Review[] {
  return REVIEWS.filter((r) => r.topics.includes(topic)).slice(0, limit);
}

export function reviewById(id: string): Review {
  const review = REVIEWS.find((r) => r.id === id);
  if (!review) throw new Error(`Unknown review id: ${id}`);
  return review;
}

export const REVIEW_TOPIC_LABELS: Record<ReviewTopic, string> = {
  noodles: 'Noodles',
  dumplings: 'Dumplings',
  skewers: 'Skewers',
  'hot-pot': 'Hot pots',
  'fried-chicken': 'Fried chicken',
  family: 'Families',
  atmosphere: 'Atmosphere',
  value: 'Value',
  service: 'Service',
  location: 'Location',
};
