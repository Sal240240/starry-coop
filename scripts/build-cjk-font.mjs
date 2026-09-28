#!/usr/bin/env node
/**
 * Builds a self-hosted Noto Serif SC subset containing only the Chinese
 * characters used in *display* positions (brand, navigation, eyebrows,
 * headings, seals). Body text and dish names use the visitor's system CJK
 * font, so the download stays small.
 *
 *   npm run build && npm run fonts:cjk && npm run build
 *
 * Re-run after changing Chinese display copy. scripts/verify-dist.mjs fails
 * the build if a display character is missing from the committed subset.
 * Font licence: SIL Open Font License 1.1 (subsetting permitted).
 */
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { DIST, FONT_DIR, ROOT, collectDisplayChars } from './lib/dist.mjs';

const FONT_FILE = join(FONT_DIR, 'starry-serif-sc.woff2');
const MANIFEST = join(FONT_DIR, 'starry-serif-sc.chars.txt');
const BUDGET_BYTES = 50 * 1024;
const WEIGHT = 600;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

async function main() {
  const chars = await collectDisplayChars(DIST);
  if (chars.length === 0) throw new Error('No display Chinese found. Run `npm run build` first.');

  const cssUrl =
    `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@${WEIGHT}&display=swap&text=` +
    encodeURIComponent(chars.join(''));
  const cssRes = await fetch(cssUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!cssRes.ok) throw new Error(`Google Fonts CSS request failed: HTTP ${cssRes.status}`);
  const css = await cssRes.text();

  const urls = [...css.matchAll(/url\((https:[^)]+)\)\s*format\('woff2'\)/g)].map((m) => m[1]);
  if (urls.length !== 1) throw new Error(`Expected one woff2 file, got ${urls.length}.`);

  const fontRes = await fetch(urls[0], { headers: { 'User-Agent': USER_AGENT } });
  if (!fontRes.ok) throw new Error(`Font download failed: HTTP ${fontRes.status}`);

  await mkdir(FONT_DIR, { recursive: true });
  await writeFile(FONT_FILE, Buffer.from(await fontRes.arrayBuffer()));
  await writeFile(MANIFEST, chars.join('') + '\n', 'utf8');

  const size = (await stat(FONT_FILE)).size;
  console.log(`✓ ${chars.length} display characters → ${relative(ROOT, FONT_FILE)} (${(size / 1024).toFixed(1)} KB)`);
  if (size > BUDGET_BYTES) {
    console.error(`✗ Subset exceeds the ${BUDGET_BYTES / 1024} KB budget. Trim Chinese display copy.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
