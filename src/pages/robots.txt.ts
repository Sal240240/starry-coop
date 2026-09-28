import type { APIRoute } from 'astro';

/** Production (SITE_URL set): allow all + sitemap. Previews: disallow everything. */
export const GET: APIRoute = ({ site }) => {
  const body = __SITE_INDEXABLE__
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
