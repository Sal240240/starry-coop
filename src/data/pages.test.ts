import { describe, expect, test } from 'vitest';
import { PAGES } from './pages';

const pages = Object.entries(PAGES);

describe('SEO registry', () => {
  test.each(pages)('%s: title is 30–62 characters', (_, page) => {
    expect(page.title.length).toBeGreaterThanOrEqual(30);
    expect(page.title.length).toBeLessThanOrEqual(62);
  });

  test.each(pages)('%s: description is 120–160 characters', (_, page) => {
    expect(page.description.length).toBeGreaterThanOrEqual(120);
    expect(page.description.length).toBeLessThanOrEqual(160);
  });

  test('titles, descriptions, H1s and paths are unique', () => {
    for (const key of ['title', 'description', 'h1', 'path'] as const) {
      const values = pages.map(([, p]) => p[key]);
      expect(new Set(values).size, `duplicate ${key}`).toBe(values.length);
    }
  });

  test('paths use trailing slashes', () => {
    for (const [, page] of pages) expect(page.path).toMatch(/\/$/);
  });

  test('no primary keyword is targeted by two pages', () => {
    const all = pages.flatMap(([, p]) => p.keywords);
    expect(new Set(all).size).toBe(all.length);
  });

  test('no superlative claims we cannot support', () => {
    for (const [, page] of pages) {
      expect(`${page.title} ${page.description}`).not.toMatch(/\bbest\b|#1|number one/i);
    }
  });
});
