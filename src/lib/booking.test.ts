import { describe, expect, test } from 'vitest';
import { buildSmsBody, validateBooking, type BookingInput } from './booking';

const TODAY = '2026-09-27';

const valid: BookingInput = {
  name: 'Jordan Lee',
  phone: '(604) 555-0142',
  email: 'jordan@example.com',
  date: '2026-10-02',
  time: '18:30',
  partySize: '4',
  occasion: 'Birthday',
  notes: 'High chair please',
  company: '', // honeypot
};

describe('validateBooking', () => {
  test('accepts a complete valid request and normalises fields', () => {
    const result = validateBooking(valid, TODAY);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.phone).toBe('+16045550142');
    expect(result.data.partySize).toBe(4);
    expect(result.data.name).toBe('Jordan Lee');
  });

  test('treats email as optional', () => {
    const result = validateBooking({ ...valid, email: '' }, TODAY);
    expect(result.ok).toBe(true);
  });

  test('rejects a missing name and a short phone number', () => {
    const result = validateBooking({ ...valid, name: ' ', phone: '555-01' }, TODAY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toMatch(/name/i);
    expect(result.errors.phone).toMatch(/phone/i);
  });

  test('rejects an invalid email when one is provided', () => {
    const result = validateBooking({ ...valid, email: 'not-an-email' }, TODAY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toBeDefined();
  });

  test('rejects dates in the past or more than 90 days ahead', () => {
    const past = validateBooking({ ...valid, date: '2026-09-26' }, TODAY);
    const far = validateBooking({ ...valid, date: '2027-01-15' }, TODAY);
    expect(past.ok).toBe(false);
    expect(far.ok).toBe(false);
  });

  test('rejects a time outside the bookable slots for that day', () => {
    const tooLate = validateBooking({ ...valid, date: '2026-09-29', time: '20:45' }, TODAY);
    expect(tooLate.ok).toBe(false);
    if (tooLate.ok) return;
    expect(tooLate.errors.time).toBeDefined();
  });

  test('rejects a same-day time that is less than 30 minutes away', () => {
    // Sunday 27 Sep, now 18:10 local → earliest bookable is 18:40 → first slot 18:45
    const nowMinutes = 18 * 60 + 10;
    const tooSoon = validateBooking({ ...valid, date: TODAY, time: '18:30' }, TODAY, nowMinutes);
    const fine = validateBooking({ ...valid, date: TODAY, time: '18:45' }, TODAY, nowMinutes);
    expect(tooSoon.ok).toBe(false);
    expect(fine.ok).toBe(true);
  });

  test('limits online requests to parties of 1–20', () => {
    expect(validateBooking({ ...valid, partySize: '0' }, TODAY).ok).toBe(false);
    expect(validateBooking({ ...valid, partySize: '21' }, TODAY).ok).toBe(false);
    expect(validateBooking({ ...valid, partySize: 'four' }, TODAY).ok).toBe(false);
  });

  test('silently flags spam when the honeypot is filled', () => {
    const result = validateBooking({ ...valid, company: 'Acme SEO' }, TODAY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.spam).toBe(true);
  });

  test('caps notes at 500 characters', () => {
    const result = validateBooking({ ...valid, notes: 'x'.repeat(501) }, TODAY);
    expect(result.ok).toBe(false);
  });

  test('strips control characters from free text', () => {
    const result = validateBooking({ ...valid, notes: 'Window\u0000 seat\u0007 please' }, TODAY);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.notes).toBe('Window seat please');
  });
});

describe('buildSmsBody', () => {
  test('summarises the request in a readable text message', () => {
    const result = validateBooking(valid, TODAY);
    if (!result.ok) throw new Error('fixture should be valid');
    const body = buildSmsBody(result.data);
    expect(body).toContain('Starry Coop');
    expect(body).toContain('4 people');
    expect(body).toContain('Fri, Oct 2');
    expect(body).toContain('6:30 p.m.');
    expect(body).toContain('Jordan Lee');
  });
});
