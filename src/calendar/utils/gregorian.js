export function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getGregorianMonthLength(year, month) {
  if (month === 2) return isGregorianLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

export function getGregorianWeekday(year, month, day) {
  const date = new Date(year, month - 1, day);
  return date.getDay();
}

export function gregorianToDate(year, month, day, hours = 0, minutes = 0, seconds = 0, ms = 0) {
  return new Date(year, month - 1, day, hours, minutes, seconds, ms);
}

export function dateToGregorian(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    ms: date.getMilliseconds(),
  };
}
