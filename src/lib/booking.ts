/**
 * Reservation-request validation, shared by the browser form and the
 * optional AWS Lambda endpoint (infra/booking-function) so the rules
 * can never drift between client and server.
 */
import { SITE, formatTime } from '../data/site';
import { getTimeSlots, parseIsoDate } from './hours';

export const BOOKING_LIMITS = {
  minParty: 1,
  maxParty: 20,
  largePartyThreshold: 9,
  maxDaysAhead: 90,
  maxNameLength: 80,
  maxNotesLength: 500,
  maxOccasionLength: 40,
} as const;

export interface BookingInput {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  partySize: string;
  occasion?: string;
  notes?: string;
  /** Honeypot — must stay empty. Real people never see this field. */
  company?: string;
}

export interface BookingRequest {
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  partySize: number;
  occasion: string | null;
  notes: string | null;
}

export type BookingField = keyof Omit<BookingInput, 'company'>;

export type ValidationResult =
  | { ok: true; data: BookingRequest }
  | { ok: false; errors: Partial<Record<BookingField, string>>; spam?: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const clean = (value: string | undefined): string =>
  (value ?? '').replace(CONTROL_CHARS, '').replace(/\s+/g, ' ').trim();

/** North American numbers only; returns E.164 or null. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

const daysBetween = (fromIso: string, toIso: string): number | null => {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  if (!from || !to) return null;
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
};

/**
 * @param input raw form values
 * @param todayIso today's date in the restaurant's time zone (YYYY-MM-DD)
 * @param nowMinutes current local time in minutes since midnight; enforces
 *                   30 minutes' notice for same-day requests when provided
 */
export function validateBooking(
  input: BookingInput,
  todayIso: string,
  nowMinutes?: number,
): ValidationResult {
  if (clean(input.company).length > 0) {
    return { ok: false, errors: {}, spam: true };
  }

  const errors: Partial<Record<BookingField, string>> = {};

  const name = clean(input.name);
  if (name.length < 2 || name.length > BOOKING_LIMITS.maxNameLength) {
    errors.name = 'Please enter your name.';
  }

  const phone = normalisePhone(clean(input.phone));
  if (!phone) errors.phone = 'Please enter a 10-digit phone number so we can confirm.';

  const email = clean(input.email);
  if (email && (!EMAIL_PATTERN.test(email) || email.length > 254)) {
    errors.email = 'That email address doesn’t look right.';
  }

  const date = clean(input.date);
  const offset = daysBetween(todayIso, date);
  if (offset === null) {
    errors.date = 'Please choose a date.';
  } else if (offset < 0) {
    errors.date = 'Please choose today or a future date.';
  } else if (offset > BOOKING_LIMITS.maxDaysAhead) {
    errors.date = `We take requests up to ${BOOKING_LIMITS.maxDaysAhead} days ahead.`;
  }

  const time = clean(input.time);
  const slots = getTimeSlots(date, date === todayIso ? nowMinutes : undefined);
  if (!errors.date && !slots.includes(time)) {
    errors.time = 'Please choose an arrival time from the list.';
  }

  const partyRaw = clean(input.partySize);
  const partySize = /^\d{1,2}$/.test(partyRaw) ? Number(partyRaw) : NaN;
  if (!(partySize >= BOOKING_LIMITS.minParty && partySize <= BOOKING_LIMITS.maxParty)) {
    errors.partySize = `Online requests are for 1–${BOOKING_LIMITS.maxParty} guests. For larger groups, please call us.`;
  }

  const occasion = clean(input.occasion).slice(0, BOOKING_LIMITS.maxOccasionLength);

  const notes = clean(input.notes);
  if (notes.length > BOOKING_LIMITS.maxNotesLength) {
    errors.notes = `Please keep notes under ${BOOKING_LIMITS.maxNotesLength} characters.`;
  }

  if (Object.keys(errors).length > 0 || !phone) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      email: email || null,
      date,
      time,
      partySize,
      occasion: occasion || null,
      notes: notes || null,
    },
  };
}

/** "Fri, Oct 2" for a YYYY-MM-DD date (time-zone safe). */
export function formatBookingDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '');
}

/** Plain-text summary used for the SMS fallback and email notifications. */
export function buildSmsBody(req: BookingRequest): string {
  const people = `${req.partySize} ${req.partySize === 1 ? 'person' : 'people'}`;
  const lines = [
    `Hi ${SITE.name}! Table request:`,
    `${people} · ${formatBookingDate(req.date)} · ${formatTime(req.time)}`,
    `Name: ${req.name}`,
    req.occasion ? `Occasion: ${req.occasion}` : '',
    req.notes ? `Notes: ${req.notes}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}
