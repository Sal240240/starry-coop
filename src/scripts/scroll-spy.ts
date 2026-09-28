/**
 * Highlights the in-page nav link for the section currently in view
 * (menu categories). Markup contract:
 *   <nav data-scroll-spy> <a href="#section-id">…</a> … </nav>
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-scroll-spy]').forEach((nav) => {
  const links = new Map<string, HTMLAnchorElement>();
  nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    links.set(decodeURIComponent(a.hash.slice(1)), a);
  });

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  const setActive = (id: string): void => {
    links.forEach((link, key) => {
      if (key === id) {
        link.setAttribute('aria-current', 'true');
        // Keep the active chip visible in a horizontally scrolling bar
        // without moving the page itself.
        const scroller = link.closest<HTMLElement>('[data-scroll-spy-track]') ?? nav;
        const target = link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2;
        scroller.scrollTo({ left: Math.max(0, target), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) setActive(visible[0].target.id);
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  sections.forEach((s) => observer.observe(s));
});
