/**
 * Reservation-request form (progressive enhancement).
 *
 * Markup contract (see components/BookingForm.astro):
 *   form[data-booking-form][data-endpoint][data-phone][data-sms]
 *     fields named: name, phone, email, date, time, partySize, occasion, notes, company (honeypot)
 *     [data-error-for="<field>"]   inline error text per field
 *     [data-booking-status]        polite live region for form-level messages
 *     [data-booking-success]       panel shown after a successful send
 *     [data-booking-fallback]      panel shown when there is no endpoint or it fails
 */
import {
  BOOKING_LIMITS,
  buildSmsBody,
  formatBookingDate,
  validateBooking,
  type BookingField,
  type BookingInput,
  type BookingRequest,
} from '../lib/booking';
import { getTimeSlots, localParts } from '../lib/hours';
import { formatTime } from '../data/site';

const REQUEST_TIMEOUT_MS = 10_000;
const FIELDS: BookingField[] = ['name', 'phone', 'email', 'date', 'time', 'partySize', 'occasion', 'notes'];

interface ApiResponse {
  success?: boolean;
  data?: { reference?: string } | null;
  error?: string | null;
  fields?: Partial<Record<BookingField, string>>;
}

interface SendResult {
  ok: boolean;
  payload: ApiResponse;
}

const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
};

function initForm(form: HTMLFormElement): void {
  const endpoint = form.dataset.endpoint ?? '';
  const phone = form.dataset.phone ?? '';
  const smsEnabled = form.dataset.sms === 'true';

  const field = <T extends HTMLElement>(name: string): T | null =>
    form.elements.namedItem(name) as T | null;
  const dateInput = field<HTMLInputElement>('date');
  const timeSelect = field<HTMLSelectElement>('time');
  const status = form.querySelector<HTMLElement>('[data-booking-status]');
  const success = form.parentElement?.querySelector<HTMLElement>('[data-booking-success]') ?? null;
  const fallback = form.parentElement?.querySelector<HTMLElement>('[data-booking-fallback]') ?? null;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!dateInput || !timeSelect) return;

  const now = (): { isoDate: string; minutes: number } => localParts(new Date());
  const startedAt = Date.now();

  // Constrain the date picker to today … +90 days (Vancouver time).
  const today = now().isoDate;
  dateInput.min = today;
  dateInput.max = addDays(today, BOOKING_LIMITS.maxDaysAhead);

  const renderSlots = (): void => {
    const iso = dateInput.value;
    const { isoDate, minutes } = now();
    const slots = iso ? getTimeSlots(iso, iso === isoDate ? minutes : undefined) : [];
    const previous = timeSelect.value;
    const placeholder = new Option(
      iso ? (slots.length ? 'Choose a time' : 'No times left today — try another date') : 'Choose a date first',
      '',
    );
    const options = slots.map((s) => new Option(formatTime(s), s, false, s === previous));
    timeSelect.replaceChildren(placeholder, ...options);
    timeSelect.disabled = slots.length === 0;
  };
  dateInput.addEventListener('change', renderSlots);

  // Prefill from the homepage mini form (/booking/?date=…&time=…&party=…).
  const params = new URLSearchParams(window.location.search);
  const qDate = params.get('date') ?? '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(qDate) && qDate >= dateInput.min && qDate <= dateInput.max) {
    dateInput.value = qDate;
  }
  const qParty = params.get('party') ?? '';
  const partySelect = field<HTMLSelectElement>('partySize');
  if (partySelect && /^\d{1,2}$/.test(qParty) && [...partySelect.options].some((o) => o.value === qParty)) {
    partySelect.value = qParty;
  }
  renderSlots();
  const qTime = params.get('time') ?? '';
  if ([...timeSelect.options].some((o) => o.value === qTime && qTime !== '')) timeSelect.value = qTime;

  const readInput = (): BookingInput => {
    const value = (name: string): string =>
      (field<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name)?.value ?? '').toString();
    return {
      name: value('name'),
      phone: value('phone'),
      email: value('email'),
      date: value('date'),
      time: value('time'),
      partySize: value('partySize'),
      occasion: value('occasion'),
      notes: value('notes'),
      company: value('company'),
    };
  };

  const setErrors = (errors: Partial<Record<BookingField, string>>): void => {
    FIELDS.forEach((name) => {
      const input = field<HTMLElement>(name);
      const message = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      const text = errors[name];
      if (input) {
        if (text) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
      if (message) {
        message.textContent = text ?? '';
        message.hidden = !text;
      }
    });
    const first = FIELDS.find((name) => errors[name]);
    if (first) field<HTMLElement>(first)?.focus();
  };

  const announce = (text: string): void => {
    if (status) status.textContent = text;
  };

  const summarise = (req: BookingRequest): string =>
    `${req.partySize} ${req.partySize === 1 ? 'guest' : 'guests'} · ${formatBookingDate(req.date)} · ${formatTime(req.time)}`;

  const showPanel = (panel: HTMLElement | null): void => {
    if (!panel) return;
    form.hidden = true;
    panel.hidden = false;
    panel.focus();
  };

  const showFallback = (req: BookingRequest, reason: string): void => {
    if (!fallback) return;
    const body = buildSmsBody(req);
    const summary = fallback.querySelector<HTMLElement>('[data-fallback-summary]');
    const reasonEl = fallback.querySelector<HTMLElement>('[data-fallback-reason]');
    const sms = fallback.querySelector<HTMLAnchorElement>('[data-sms-link]');
    const copy = fallback.querySelector<HTMLButtonElement>('[data-copy-details]');
    if (summary) summary.textContent = summarise(req);
    if (reasonEl) reasonEl.textContent = reason;
    if (sms) {
      sms.hidden = !smsEnabled;
      sms.href = `sms:${phone}?&body=${encodeURIComponent(body)}`;
    }
    if (copy) {
      copy.hidden = !navigator.clipboard;
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(body);
          copy.textContent = 'Details copied';
        } catch {
          copy.textContent = 'Copy failed — please read them to us';
        }
      };
    }
    showPanel(fallback);
  };

  const send = async (req: BookingRequest): Promise<SendResult> => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...readInput(), partySize: String(req.partySize), startedAt: String(startedAt) }),
        signal: controller.signal,
        credentials: 'omit',
        mode: 'cors',
      });
      const payload = (await response.json().catch(() => ({}))) as ApiResponse;
      return { ok: response.ok, payload };
    } finally {
      window.clearTimeout(timer);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { isoDate, minutes } = now();
    const result = validateBooking(readInput(), isoDate, minutes);

    if (!result.ok) {
      if (result.spam) {
        showPanel(success);
        return;
      }
      setErrors(result.errors);
      announce('Please check the highlighted fields.');
      return;
    }

    setErrors({});
    const req = result.data;

    if (!endpoint) {
      showFallback(req, 'Call us to confirm your table — we’ll have your details ready below.');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.dataset.loading = 'true';
    }
    announce('Sending your request…');

    try {
      const { ok, payload } = await send(req);
      // Our Lambda returns { success: true }; generic form services just return 2xx.
      if (payload.success === true || (ok && payload.success === undefined)) {
        const summary = success?.querySelector<HTMLElement>('[data-booking-summary]');
        const ref = success?.querySelector<HTMLElement>('[data-booking-ref]');
        if (summary) summary.textContent = summarise(req);
        if (ref) ref.textContent = payload.data?.reference ?? '';
        showPanel(success);
        return;
      }
      if (payload.fields && Object.keys(payload.fields).length > 0) {
        setErrors(payload.fields);
        announce(payload.error ?? 'Please check the highlighted fields.');
        return;
      }
      showFallback(req, payload.error ?? 'We couldn’t send your request online.');
    } catch {
      showFallback(req, 'We couldn’t reach our booking service just now.');
    } finally {
      if (submit) {
        submit.disabled = false;
        delete submit.dataset.loading;
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-booking-form]').forEach(initForm);
