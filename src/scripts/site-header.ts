/**
 * Site header: scrolled state + accessible mobile navigation.
 * Markup contract (components/SiteHeader.astro):
 *   header[data-site-header]
 *     button[data-nav-toggle][aria-controls][aria-expanded]
 *     [data-nav-panel]   the collapsible navigation panel
 */
const DESKTOP_QUERY = '(min-width: 64em)';
const SCROLLED_OFFSET_PX = 12;

const header = document.querySelector<HTMLElement>('[data-site-header]');
const toggle = header?.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const panel = header?.querySelector<HTMLElement>('[data-nav-panel]');

if (header) {
  let ticking = false;
  const updateScrolled = (): void => {
    header.toggleAttribute('data-scrolled', window.scrollY > SCROLLED_OFFSET_PX);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrolled);
      }
    },
    { passive: true },
  );
  updateScrolled();
}

if (header && toggle && panel) {
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const focusables = (): HTMLElement[] =>
    [...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
      (el) => el.offsetParent !== null,
    );

  const setOpen = (open: boolean, restoreFocus = true): void => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.toggleAttribute('data-nav-open', open);
    document.documentElement.toggleAttribute('data-scroll-locked', open);
    if (open) {
      focusables()[0]?.focus();
    } else if (restoreFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a[href]')) setOpen(false, false);
  });

  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    // Keep keyboard focus inside the open menu (toggle + panel links).
    const items = [toggle, ...focusables()];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false, false);
  });
}
