/**
 * Click-to-load Google Map. No request goes to Google until the visitor asks,
 * which keeps pages fast and avoids third-party cookies by default.
 * Markup contract (components/MapCard.astro):
 *   [data-map-card]
 *     [data-map-facade][data-map-src][data-map-title]   the illustrated map frame
 *     button[data-map-load]
 */
const ALLOWED_PREFIX = 'https://www.google.com/maps';

document.querySelectorAll<HTMLButtonElement>('[data-map-card] [data-map-load]').forEach((button) => {
  const facade = button.closest('[data-map-card]')?.querySelector<HTMLElement>('[data-map-facade]');
  const src = facade?.dataset.mapSrc ?? '';
  if (!facade || !src.startsWith(ALLOWED_PREFIX)) {
    button.hidden = true;
    return;
  }

  button.addEventListener(
    'click',
    () => {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = facade.dataset.mapTitle ?? 'Map';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.className = 'map-facade__frame';
      facade.append(iframe);
      facade.dataset.state = 'loaded';
      button.hidden = true;
      iframe.focus();
    },
    { once: true },
  );
});
