import { dateToGregorian, getGregorianMonthLength, getGregorianWeekday, gregorianToDate } from './gregorian.js';
import { dateToHijri, getHijriMonthLength, hijriToDate } from './hijri.js';
import { dateToJalali, getJalaliMonthLength, jalaliToDate } from './jalali.js';

export const CALENDAR_SYSTEMS = ['gregorian', 'jalali', 'hijri'];

export function resolveCalendarSystem(calendarSystem, locale) {
  if (calendarSystem) return calendarSystem;
  if (locale === 'fa') return 'jalali';
  if (locale === 'ar') return 'hijri';
  return 'gregorian';
}

export function toCalendarParts(date, system = 'gregorian') {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  if (system === 'jalali') return dateToJalali(date);
  if (system === 'hijri') return dateToHijri(date);
  return dateToGregorian(date);
}

export function fromCalendarParts(parts, system = 'gregorian') {
  if (!parts) return null;
  const {
    year, month, day, hours = 0, minutes = 0, seconds = 0, ms = 0,
  } = parts;
  if (system === 'jalali') return jalaliToDate(year, month, day, hours, minutes, seconds, ms);
  if (system === 'hijri') return hijriToDate(year, month, day, hours, minutes, seconds, ms);
  return gregorianToDate(year, month, day, hours, minutes, seconds, ms);
}

export function getMonthLength(year, month, system = 'gregorian') {
  if (system === 'jalali') return getJalaliMonthLength(year, month);
  if (system === 'hijri') return getHijriMonthLength(year, month);
  return getGregorianMonthLength(year, month);
}

export function getWeekday(year, month, day, system = 'gregorian') {
  const date = fromCalendarParts({ year, month, day }, system);
  return date.getDay();
}

export function addMonths(year, month, offset, system = 'gregorian') {
  let y = year;
  let m = month + offset;
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  return { year: y, month: m };
}

export function addYears(year, offset) {
  return { year: year + offset };
}

export function clampDay(year, month, day, system = 'gregorian') {
  const max = getMonthLength(year, month, system);
  return Math.min(Math.max(1, day), max);
}

export function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function sameDay(a, b) {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isDateInRange(date, minDate, maxDate) {
  if (!date) return true;
  const time = date.getTime();
  if (minDate && time < startOfDay(minDate).getTime()) return false;
  if (maxDate && time > startOfDay(maxDate).getTime() + 86399999) return false;
  return true;
}

export function cloneDate(date) {
  return date ? new Date(date.getTime()) : null;
}

export function setTimeOnDate(date, hours, minutes, seconds = 0, ms = 0) {
  const next = cloneDate(date) ?? new Date();
  next.setHours(hours, minutes, seconds, ms);
  return next;
}

export function today() {
  return new Date();
}

export function normalizeValue(value, selectionMode = 'single') {
  if (selectionMode === 'multiple') {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }
  if (selectionMode === 'range') {
    return Array.isArray(value) ? value.filter(Boolean).slice(0, 2) : [];
  }
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : null;
}
