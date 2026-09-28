#!/usr/bin/env node
/**
 * Post-build quality gate. Runs after `astro build` (locally and on Amplify)
 * and fails the build if a page breaks one of the site's rules.
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { DIST, FONT_DIR, collectDisplayChars, htmlFiles, loadPage } from './lib/dist.mjs';

const BANNED_TEXT = /\b(Amy|Claudia|Jaroenying|Banzon)\b/;
const MAX_PAGES_PER_PHOTO = 2;
const errors = [];
const photoPages = new Map();

const fail = (file, message) => errors.push(`${relative(DIST, file)}: ${message}`);

for await (const file of htmlFiles()) {
  const doc = await loadPage(file);
  const html = await readFile(file, 'utf8');
  const isRedirectOr404 = file.endsWith('404.html');

  const h1s = doc.querySelectorAll('h1');
  if (h1s.length !== 1) fail(file, `expected exactly one <h1>, found ${h1s.length}`);
  if (!doc.querySelector('title')?.textContent.trim()) fail(file, 'missing <title>');
  if (!doc.querySelector('meta[name="description"]')?.getAttribute('content')) fail(file, 'missing meta description');
  if (!isRedirectOr404 && !doc.querySelector('link[rel="canonical"]')) fail(file, 'missing canonical link');
  if (!doc.querySelector('meta[http-equiv="content-security-policy"]')) fail(file, 'missing CSP meta tag');

  for (const el of doc.querySelectorAll('[style]')) {
    fail(file, `inline style attribute on <${el.tagName.toLowerCase()}> (blocked by CSP)`);
  }
  for (const img of doc.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) fail(file, `<img src="${img.getAttribute('src')}"> has no alt attribute`);
  }
  for (const el of doc.querySelectorAll('script[src], link[rel="stylesheet"]')) {
    const url = el.getAttribute('src') ?? el.getAttribute('href') ?? '';
    if (/^(https?:)?\/\//.test(url)) fail(file, `third-party asset ${url}`);
  }
  for (const a of doc.querySelectorAll('a[href^="/"]')) {
    const path = (a.getAttribute('href') ?? '').split(/[?#]/)[0];
    const target = path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
    if (!existsSync(target)) fail(file, `broken internal link ${path}`);
  }
  const text = doc.querySelector('body')?.textContent ?? '';
  if (BANNED_TEXT.test(text)) fail(file, `banned name found: ${text.match(BANNED_TEXT)?.[0]}`);

  // Photo usage: count distinct pages per source photo (hashed names start with the file name).
  // Ignore JSON-LD and <meta> (OG/schema images aren't on-page visuals).
  const visualHtml = html
    .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<meta[^>]*>/g, '');
  const used = new Set();
  for (const m of visualHtml.matchAll(/\/_astro\/([a-z0-9-]+)\.[A-Za-z0-9_-]{8}(?:_[A-Za-z0-9]+)?\.(?:avif|webp|jpe?g)/g)) {
    used.add(m[1]);
  }
  for (const name of used) {
    photoPages.set(name, [...(photoPages.get(name) ?? []), relative(DIST, file)]);
  }
}

for (const [name, pages] of photoPages) {
  if (pages.length > MAX_PAGES_PER_PHOTO) {
    errors.push(`photo "${name}" appears on ${pages.length} pages (max ${MAX_PAGES_PER_PHOTO}): ${pages.join(', ')}`);
  }
}

const manifest = await readFile(join(FONT_DIR, 'starry-serif-sc.chars.txt'), 'utf8');
const missing = (await collectDisplayChars()).filter((ch) => !manifest.includes(ch));
if (missing.length) {
  errors.push(`display Chinese not in the font subset: ${missing.join('')} (run: npm run fonts:cjk)`);
}

if (errors.length) {
  console.error(`✗ verify-dist found ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ verify-dist: all pages pass (${photoPages.size} photos, each on ≤ ${MAX_PAGES_PER_PHOTO} pages)`);
