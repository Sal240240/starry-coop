import type { Faq } from '../lib/schema';
import { SITE } from './site';

/**
 * Answers use only confirmed facts (see research/FINAL_PLAN.md §6).
 * Plain text: reused verbatim in FAQPage JSON-LD.
 */
export function buildFaqs(onlineBooking: boolean): Faq[] {
  return [
    {
      q: 'Where is Starry Coop?',
      a: `We’re upstairs at ${SITE.address.street}, ${SITE.address.city}, on Marine Drive in Ambleside, a short walk from Ambleside Beach. Look for the pink “Starry Coop — Skewer in Pot” sign at the street door, then head up the stairs.`,
    },
    {
      q: 'What are your hours?',
      a: 'We’re open every day from 11 a.m. Monday to Thursday we close at 9 p.m.; Friday to Sunday we close at 9:30 p.m. Hours can differ on holidays, so please call ahead.',
    },
    {
      q: 'Can I reserve a table?',
      a: onlineBooking
        ? `Yes. Send a table request on our Reserve page and we’ll call you to confirm, or phone us at ${SITE.phone.display}.`
        : `Yes. Please call us at ${SITE.phone.display} to reserve a table.`,
    },
    {
      q: 'What is skewers in pot (冷锅串串香)?',
      a: 'It’s the dish on our sign. Pick your skewers from our self-serve fridge at $0.58 a stick, have them BBQ-style or in the pot, then mix your own dip at the sauce bar. The pot base is $2.98.',
    },
    {
      q: 'Are the noodles and dumplings really handmade?',
      a: 'Yes. Our noodles and dumplings are made by hand in our kitchen, and our sauces are made in-house. Dumplings come boiled, in chili oil, steamed or pan-fried.',
    },
    {
      q: 'Do you have vegan or vegetarian options?',
      a: 'Our Google profile lists vegan options, and the menu includes vegetable skewers, cold salads, grilled eggplant and tomato scrambled eggs. Some dishes share sauces, broths or equipment, so please tell us about your needs when you order.',
    },
    {
      q: 'Is Starry Coop good for kids and families?',
      a: 'Families are very welcome. There’s a reading and games corner, kid-friendly dishes like chicken burgers and popcorn chicken, and free ice cream all day.',
    },
    {
      q: 'Is the coffee and ice cream really free?',
      a: 'Yes. Coffee and ice cream are free all day from our coffee, ice cream and dessert bar.',
    },
    {
      q: 'Do you have a happy hour?',
      a: 'Yes, we offer happy-hour food. Please call or ask your server for today’s specials.',
    },
    {
      q: 'Can I order takeout or delivery?',
      a: `Yes. Call ${SITE.phone.display} to order for pickup, or order through Uber Eats.`,
    },
    {
      q: 'How much does a meal cost?',
      a: 'About $20–30 per person, according to diners on Google. Many noodle and rice bowls are under $10, and skewers in pot are $0.58 a stick.',
    },
    {
      q: 'Can you host a group?',
      a: `Yes. Our sharing hot pots, skewer trays and Peking Duck are made for the table. For larger groups, please call ${SITE.phone.display} ahead so we can plan your table.`,
    },
    {
      q: 'Is the restaurant accessible?',
      a: `Our dining room is on the second floor. You enter by the street door and go up one flight of stairs. If you have questions about access, please call us at ${SITE.phone.display} before you visit.`,
    },
  ];
}
