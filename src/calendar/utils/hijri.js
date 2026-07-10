import { gregorianToDate } from './gregorian.js';

function gregorianToJulianDay(gy, gm, gd) {
  const a = Math.trunc((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  return gd + Math.trunc((153 * m + 2) / 5) + 365 * y + Math.trunc(y / 4) - Math.trunc(y / 100) + Math.trunc(y / 400) - 32045;
}

function julianDayToGregorian(jdn) {
  const j = jdn + 32044;
  const g = Math.trunc(j / 146097);
  const dg = j % 146097;
  const c = Math.trunc((Math.trunc(dg / 36524) + 1) * 3 / 4);
  const dc = dg - c * 36524;
  const b = Math.trunc(dc / 1461);
  const db = dc % 1461;
  const a = Math.trunc(db / 365);
  const y = g * 400 + c * 100 + b * 4 + a;
  const m = Math.trunc((db % 365 * 5 + 308) / 153) - 2;
  const d = db % 365 - Math.trunc((m + 4) * 153 / 5) + 122;
  return {
    gy: y - 4800 + Math.trunc((m + 2) / 12),
    gm: (m + 2) % 12 + 1,
    gd: d + 1,
  };
}

function islamicToJulianDay(iy, im, id) {
  return Math.trunc((11 * iy + 3) / 30) + 354 * iy + 30 * im - Math.trunc((im - 1) / 2) + id + 1948440 - 385;
}

function julianDayToIslamic(jdn) {
  const jd = Math.trunc(jdn) + 0.5;
  const l = jd - 1948440 + 10632;
  const n = Math.trunc((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.trunc((10985 - l2) / 5316) * Math.trunc((50 * l2) / 17719)
    + Math.trunc(l2 / 5670) * Math.trunc((43 * l2) / 15238);
  const l3 = l2 - Math.trunc((30 - j) / 15) * Math.trunc((17719 * j) / 50)
    - Math.trunc(j / 16) * Math.trunc((15238 * j) / 43) + 29;
  const im = Math.trunc((24 * l3) / 709);
  const id = l3 - Math.trunc((709 * im) / 24);
  const iy = 30 * n + j - 30;
  return { hy: iy, hm: im, hd: id };
}

export function gregorianToHijri(gy, gm, gd) {
  const { hy, hm, hd } = julianDayToIslamic(gregorianToJulianDay(gy, gm, gd));
  return { year: hy, month: hm, day: hd };
}

export function hijriToGregorian(hy, hm, hd) {
  const g = julianDayToGregorian(islamicToJulianDay(hy, hm, hd));
  return { gy: g.gy, gm: g.gm, gd: g.gd };
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
