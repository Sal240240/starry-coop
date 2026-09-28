/** Shared helpers for post-build scripts that inspect dist/. */
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIST = join(ROOT, 'dist');
export const FONT_DIR = join(ROOT, 'src', 'assets', 'fonts');

/** Elements whose Chinese text is set in the display font (keep in sync with global.css). */
export const DISPLAY_SELECTOR = [
  'h1 [lang="zh-Hans"]',
  'h2 [lang="zh-Hans"]',
  'h3 [lang="zh-Hans"]',
  '.eyebrow [lang="zh-Hans"]',
  '.eyebrow .zh',
  '.brand [lang="zh-Hans"]',
  '.seal',
  '.zh-display',
].join(', ');

const HAN = /[　-〿一-鿿＀-￯]/gu;

export async function* htmlFiles(dir = DIST) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

export async function loadPage(file) {
  return parse(await readFile(file, 'utf8'), { comment: false });
}

export async function collectDisplayChars(dir = DIST) {
  const chars = new Set();
  for await (const file of htmlFiles(dir)) {
    const doc = await loadPage(file);
    for (const el of doc.querySelectorAll(DISPLAY_SELECTOR)) {
      for (const ch of el.textContent.match(HAN) ?? []) chars.add(ch);
    }
  }
  return [...chars].sort();
}
