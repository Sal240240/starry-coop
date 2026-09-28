/**
 * Live "Open now" badges. Markup contract:
 *   <span data-open-status><span data-open-status-label>Hours</span></span>
 * The server-rendered fallback text stays if JS is unavailable.
 */
import { getOpenStatus } from '../lib/hours';

const REFRESH_MS = 60_000;

function render(): void {
  const status = getOpenStatus(new Date());
  const state = status.isOpen ? (status.closingSoon ? 'closing' : 'open') : 'closed';
  document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
    el.dataset.state = state;
    const label = el.querySelector<HTMLElement>('[data-open-status-label]');
    if (label) label.textContent = status.label;
  });
}

render();
window.setInterval(render, REFRESH_MS);
