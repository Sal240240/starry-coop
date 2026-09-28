/**
 * Opening-hours logic shared by the build (static pages) and the browser
 * (live "Open now" badge). Pure functions, no DOM access.
 */
import { SITE, formatTime, type DayKey } from '../data/site';

const DAY_KEYS: DayKey[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const SHORT_TO_KEY: Record<string, DayKey> = {
  Sun: 'Su', Mon: 'Mo', Tue: 'Tu', Wed: 'We', Thu: 'Th', Fri: 'Fr', Sat: 'Sa',
};

const CLOSING_SOON_MINUTES = 45;
const SLOT_STEP_MINUTES = 15;
const LAST_SEATING_BEFORE_CLOSE_MINUTES = 60;
const MIN_NOTICE_MINUTES = 30;

export interface DayHours {
  opens: string;
  closes: string;
}

export interface LocalParts {
  day: DayKey;
  minutes: number;
  isoDate: string;
}

export interface OpenStatus {
  isOpen: boolean;
  closingSoon: boolean;
  label: string;
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const fromMinutes = (total: number): string =>
  `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

function hoursForDay(day: DayKey): DayHours | null {
  const row = SITE.hours.find((h) => (h.days as readonly DayKey[]).includes(day));
  return row ? { opens: row.opens, closes: row.closes } : null;
}

/** Wall-clock parts of an instant in the restaurant's time zone. */
export function localParts(instant: Date, timeZone: string = SITE.timezone): LocalParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';

  return {
    day: SHORT_TO_KEY[get('weekday')],
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    isoDate: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

/** Parses a strict YYYY-MM-DD calendar date; returns null when invalid. */
export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const roundTrips =
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  return roundTrips ? date : null;
}

export function hoursForDate(iso: string): DayHours | null {
  const date = parseIsoDate(iso);
  if (!date) return null;
  return hoursForDay(DAY_KEYS[date.getUTCDay()]);
}

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const { day, minutes } = localParts(now);
  const today = hoursForDay(day);
  const nextDay = DAY_KEYS[(DAY_KEYS.indexOf(day) + 1) % 7];
  const tomorrow = hoursForDay(nextDay);

  if (today) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);

    if (minutes >= opens && minutes < closes) {
      const closingSoon = closes - minutes <= CLOSING_SOON_MINUTES;
      return {
        isOpen: true,
        closingSoon,
        label: `${closingSoon ? 'Closing soon' : 'Open now'} · until ${formatTime(today.closes)}`,
      };
    }

    if (minutes < opens) {
      return { isOpen: false, closingSoon: false, label: `Closed · opens today at ${formatTime(today.opens)}` };
    }
  }

  const label = tomorrow
    ? `Closed · opens tomorrow at ${formatTime(tomorrow.opens)}`
    : 'Closed today';
  return { isOpen: false, closingSoon: false, label };
}

/**
 * Bookable arrival times ("HH:MM") for a date, in 15-minute steps.
 * @param nowMinutes pass the current local time when `iso` is today to drop
 *                   slots with less than 30 minutes' notice
 */
export function getTimeSlots(iso: string, nowMinutes?: number): string[] {
  const hours = hoursForDate(iso);
  if (!hours) return [];
  const earliest = nowMinutes === undefined ? 0 : nowMinutes + MIN_NOTICE_MINUTES;
  const first = Math.max(
    toMinutes(hours.opens),
    Math.ceil(earliest / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES,
  );
  const last = toMinutes(hours.closes) - LAST_SEATING_BEFORE_CLOSE_MINUTES;
  const slots: string[] = [];
  for (let t = first; t <= last; t += SLOT_STEP_MINUTES) slots.push(fromMinutes(t));
  return slots;
}
