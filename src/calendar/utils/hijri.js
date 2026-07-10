import { gregorianToDate, isGregorianLeapYear } from './gregorian.js';

const GREGORIAN_EPOCH = 1721425.5;
const ISLAMIC_EPOCH = 1948439.5;

function gregorianToJulianDay(gy, gm, gd) {
  return (GREGORIAN_EPOCH - 1)
    + 365 * (gy - 1)
    + Math.floor((gy - 1) / 4)
    - Math.floor((gy - 1) / 100)
    + Math.floor((gy - 1) / 400)
    + Math.floor((367 * gm - 362) / 12
      + (gm <= 2 ? 0 : (isGregorianLeapYear(gy) ? -1 : -2))
      + gd);
}

function julianDayToGregorian(jd) {
  const wjd = Math.floor(jd - 0.5) + 0.5;
  const depoch = wjd - GREGORIAN_EPOCH;
  const quadricent = Math.floor(depoch / 146097);
  const dqc = mod(depoch, 146097);
  const cent = Math.floor(dqc / 36524);
  const dcent = mod(dqc, 36524);
  const quad = Math.floor(dcent / 1461);
  const dquad = mod(dcent, 1461);
  const yindex = Math.floor(dquad / 365);
  let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
  if (!(cent === 4 || yindex === 4)) year += 1;
  const yearday = wjd - gregorianToJulianDay(year, 1, 1);
  const leapAdjust = wjd < gregorianToJulianDay(year, 3, 1)
    ? 0
    : (isGregorianLeapYear(year) ? 1 : 2);
  const gm = Math.floor(((yearday + leapAdjust) * 12 + 373) / 367);
  const gd = wjd - gregorianToJulianDay(year, gm, 1) + 1;
  return { gy: year, gm, gd };
}

function mod(a, b) {
  return a - b * Math.floor(a / b);
}

function islamicToJulianDay(iy, im, id) {
  return id
    + Math.ceil(29.5 * (im - 1))
    + (iy - 1) * 354
    + Math.floor((3 + 11 * iy) / 30)
    + ISLAMIC_EPOCH - 1;
}

function julianDayToIslamic(jd) {
  const wjd = Math.floor(jd) + 0.5;
  const year = Math.floor((30 * (wjd - ISLAMIC_EPOCH) + 10646) / 10631);
  const month = Math.min(12, Math.ceil((wjd - (29 + islamicToJulianDay(year, 1, 1))) / 29.5) + 1);
  const day = wjd - islamicToJulianDay(year, month, 1) + 1;
  return { hy: year, hm: month, hd: Math.round(day) };
}

export function gregorianToHijri(gy, gm, gd) {
  const { hy, hm, hd } = julianDayToIslamic(gregorianToJulianDay(gy, gm, gd));
  return { year: hy, month: hm, day: hd };
}

export function hijriToGregorian(hy, hm, hd) {
  const g = julianDayToGregorian(islamicToJulianDay(hy, hm, hd));
  return { gy: g.gy, gm: g.gm, gd: Math.round(g.gd) };
}

export function isHijriLeapYear(year) {
  return ((11 * year + 14) % 30) < 11;
}

export function getHijriMonthLength(year, month) {
  if (month === 12) return isHijriLeapYear(year) ? 30 : 29;
  return month % 2 === 1 ? 30 : 29;
}

export function hijriToDate(hy, hm, hd, hours = 0, minutes = 0, seconds = 0, ms = 0) {
  const g = hijriToGregorian(hy, hm, hd);
  return gregorianToDate(g.gy, g.gm, g.gd, hours, minutes, seconds, ms);
}

export function dateToHijri(date) {
  const { year, month, day } = gregorianToHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return {
    year,
    month,
    day,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    ms: date.getMilliseconds(),
  };
}
