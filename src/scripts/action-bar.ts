/**
 * Mobile quick-action bar. Hidden (and untabbable) while the hero's own
 * call-to-action buttons are on screen, so the same actions never appear
 * twice. Pages without [data-hero-ctas] show the bar immediately.
 */
const bar = document.querySelector<HTMLElement>('[data-action-bar]');
const heroCtas = document.querySelector<HTMLElement>('[data-hero-ctas]');

if (bar) {
  if (!heroCtas || !('IntersectionObserver' in window)) {
    bar.toggleAttribute('data-visible', true);
  } else {
    const observer = new IntersectionObserver(
      ([entry]) => bar.toggleAttribute('data-visible', !entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroCtas);
  }
}
