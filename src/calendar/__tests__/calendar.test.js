import { describe, expect, it } from 'vitest';
import { gregorianToJalali, jalaliToGregorian } from '../utils/jalali.js';
import { gregorianToHijri } from '../utils/hijri.js';
import { toCalendarParts } from '../utils/calendarDate.js';
import { formatDate } from '../utils/format.js';
import { resolveCalendarMode } from '../utils/mode.js';
import { getLocaleConfig } from '../utils/locale.js';

describe('calendar utils', () => {
  it('converts between gregorian and jalali', () => {
    const jalali = gregorianToJalali(2024, 3, 20);
    expect(jalali).toEqual({ jy: 1403, jm: 1, jd: 1 });

    const gregorian = jalaliToGregorian(1403, 1, 1);
    expect(gregorian).toEqual({ gy: 2024, gm: 3, gd: 20 });
  });

  it('converts gregorian date to hijri parts', () => {
    const hijri = gregorianToHijri(2024, 3, 20);
    expect(hijri.year).toBeGreaterThan(1400);
    expect(hijri.month).toBeGreaterThanOrEqual(1);
    expect(hijri.month).toBeLessThanOrEqual(12);
  });

  it('resolves calendar modes like PrimeReact view/time props', () => {
    expect(resolveCalendarMode({ mode: 'datetime' })).toBe('datetime');
    expect(resolveCalendarMode({ showTime: true })).toBe('datetime');
    expect(resolveCalendarMode({ timeOnly: true })).toBe('time');
    expect(resolveCalendarMode({ view: 'month' })).toBe('month');
    expect(resolveCalendarMode({ view: 'year' })).toBe('year');
  });

  it('formats jalali dates with persian digits', () => {
    const date = new Date(2024, 2, 20, 14, 5);
    const parts = toCalendarParts(date, 'jalali');
    const formatted = formatDate(date, 'dd/mm/yyyy', {
      calendarSystem: 'jalali',
      locale: 'fa',
      localeConfig: getLocaleConfig('fa'),
    });
    expect(parts.month).toBe(1);
    expect(formatted).toContain('۱۴۰۳');
  });
});
