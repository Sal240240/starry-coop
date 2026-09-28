import { describe, expect, test } from 'vitest';
import { getOpenStatus, getTimeSlots, hoursForDate, localParts } from './hours';

// All instants are expressed in UTC; Vancouver is UTC-7 (PDT) in late September.
const pdt = (isoLocal: string) => new Date(`${isoLocal}-07:00`);

describe('localParts', () => {
  test('converts a UTC instant to Vancouver weekday and minutes', () => {
    // Sunday 27 Sep 2026, 21:10 local
    const parts = localParts(pdt('2026-09-27T21:10:00'));
    expect(parts.day).toBe('Su');
    expect(parts.minutes).toBe(21 * 60 + 10);
    expect(parts.isoDate).toBe('2026-09-27');
  });
});

describe('hoursForDate', () => {
  test('returns weekday hours for a Tuesday', () => {
    expect(hoursForDate('2026-09-29')).toEqual({ opens: '11:00', closes: '21:00' });
  });

  test('returns weekend hours for a Saturday', () => {
    expect(hoursForDate('2026-10-03')).toEqual({ opens: '11:00', closes: '21:30' });
  });

  test('rejects malformed dates', () => {
    expect(hoursForDate('2026-13-45')).toBeNull();
    expect(hoursForDate('not-a-date')).toBeNull();
  });
});

describe('getOpenStatus', () => {
  test('reports open with closing time mid-afternoon on a weekday', () => {
    const status = getOpenStatus(pdt('2026-09-29T14:00:00'));
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe('Open now · until 9 p.m.');
  });

  test('flags closing soon within the final 45 minutes', () => {
    const status = getOpenStatus(pdt('2026-10-02T20:50:00')); // Friday, closes 21:30
    expect(status.isOpen).toBe(true);
    expect(status.closingSoon).toBe(true);
    expect(status.label).toBe('Closing soon · until 9:30 p.m.');
  });

  test('reports opening later today before 11 a.m.', () => {
    const status = getOpenStatus(pdt('2026-09-29T09:15:00'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe('Closed · opens today at 11 a.m.');
  });

  test('reports opening tomorrow after closing', () => {
    const status = getOpenStatus(pdt('2026-09-29T21:05:00'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe('Closed · opens tomorrow at 11 a.m.');
  });

  test('treats the exact closing minute as closed', () => {
    const status = getOpenStatus(pdt('2026-09-29T21:00:00'));
    expect(status.isOpen).toBe(false);
  });
});

describe('getTimeSlots', () => {
  test('offers 15-minute slots from opening until 60 minutes before close', () => {
    const slots = getTimeSlots('2026-09-29'); // Tuesday 11:00–21:00
    expect(slots[0]).toBe('11:00');
    expect(slots.at(-1)).toBe('20:00');
    expect(slots).toContain('17:45');
    expect(slots).toHaveLength(37);
  });

  test('extends to 20:30 on late-closing days', () => {
    expect(getTimeSlots('2026-10-03').at(-1)).toBe('20:30');
  });

  test('drops slots less than 30 minutes from now when a current time is given', () => {
    // now 17:20 → earliest arrival 17:50 → next slot on the 15-minute grid is 18:00
    const slots = getTimeSlots('2026-09-29', 17 * 60 + 20);
    expect(slots[0]).toBe('18:00');
  });

  test('returns no slots for an invalid date', () => {
    expect(getTimeSlots('2026-02-31')).toEqual([]);
  });
});
