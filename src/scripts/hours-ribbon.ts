/** Highlights today's row and positions the "now" marker on hours charts (Vancouver time). */
import { localParts } from '../lib/hours';

function update(): void {
  const { day, minutes } = localParts(new Date());
  document.querySelectorAll<SVGSVGElement>('svg[data-hours-ribbon]').forEach((svg) => {
    const start = Number(svg.dataset.axisStart);
    const end = Number(svg.dataset.axisEnd);
    const x0 = Number(svg.dataset.x0);
    const x1 = Number(svg.dataset.x1);

    svg.querySelectorAll<SVGGElement>('g[data-day]').forEach((row) => {
      row.classList.toggle('is-today', row.dataset.day === day);
    });

    const line = svg.querySelector<SVGLineElement>('[data-now-line]');
    if (!line) return;
    if (minutes < start || minutes > end) {
      line.setAttribute('visibility', 'hidden');
      return;
    }
    const x = x0 + ((minutes - start) / (end - start)) * (x1 - x0);
    line.setAttribute('x1', String(x));
    line.setAttribute('x2', String(x));
    line.setAttribute('visibility', 'visible');
  });
}

update();
window.setInterval(update, 60_000);
