import { describe, expect, test } from 'vitest';
import { REVIEW_SOURCES } from './review-sources';
import { REVIEWS } from './reviews';

const normalise = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Splits an excerpt on "…" into the verbatim segments it is made of. */
const segments = (excerpt: string): string[] =>
  excerpt
    .split('…')
    .map((part) => normalise(part))
    .filter((part) => part.length > 0);

const BANNED_NAMES = /\b(Amy|Claudia|Jaroenying|Banzon)\b/;

describe('review excerpts', () => {
  test('every review has a verbatim source', () => {
    for (const review of REVIEWS) {
      expect(REVIEW_SOURCES[review.id], `missing source for ${review.id}`).toBeTypeOf('string');
    }
  });

  test.each(REVIEWS.map((r) => [r.id, r] as const))('%s: text and quote are exact substrings of the source', (_, review) => {
    const source = normalise(REVIEW_SOURCES[review.id]);
    for (const part of [...segments(review.text), ...segments(review.quote)]) {
      expect(source, `"${part}" not found verbatim in ${review.id}`).toContain(part);
    }
  });

  test('the pull-quote appears inside the displayed excerpt', () => {
    for (const review of REVIEWS) {
      const text = normalise(review.text);
      for (const part of segments(review.quote)) expect(text).toContain(part);
    }
  });

  test('no staff or owner names, and no reviewer surnames, are published', () => {
    for (const review of REVIEWS) {
      expect(review.text).not.toMatch(BANNED_NAMES);
      expect(review.quote).not.toMatch(BANNED_NAMES);
      expect(review.author).not.toMatch(BANNED_NAMES);
    }
  });

  test('Chinese reviews carry a labelled translation', () => {
    for (const review of REVIEWS.filter((r) => r.lang === 'zh-Hans')) {
      expect(review.translation).toBeTruthy();
      expect(review.quoteTranslation).toBeTruthy();
    }
  });

  test('review ids are unique', () => {
    const ids = REVIEWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
