import { toCalendarParts } from './calendarDate.js';
import { formatLocaleText } from './locale.js';

const DATE_TOKEN_REGEX = /d{1,2}|m{1,2}|M{1,2}|y{2,4}|@|!/g;

function pad(value, size = 2) {
  return String(value).padStart(size, '0');
}

function format12Hour(hours) {
  const period = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12 || 12;
  return { hour, period };
}

export function formatDate(date, dateFormat = 'mm/dd/yyyy', options = {}) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

  const {
    calendarSystem = 'gregorian',
    locale = 'en',
    localeConfig,
  } = options;

  const parts = toCalendarParts(date, calendarSystem);
  if (!parts) return '';

  const monthName = localeConfig?.monthNames?.[parts.month - 1] ?? '';
  const monthShort = localeConfig?.monthNamesShort?.[parts.month - 1] ?? monthName.slice(0, 3);

  const tokens = {
    d: String(parts.day),
    dd: pad(parts.day),
    m: String(parts.month),
    mm: pad(parts.month),
    M: monthShort,
    MM: monthName,
    yy: pad(parts.year % 100),
    yyyy: String(parts.year),
  };

  const formatted = dateFormat.replace(DATE_TOKEN_REGEX, (token) => {
    if (token === '@' || token === '!') return String(date.getTime());
    if (token[0] === 'y') return token.length >= 3 ? tokens.yyyy : tokens.yy;
    return tokens[token] ?? token;
  });

  return formatLocaleText(formatted, locale);
}

export function formatTime(date, options = {}) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

  const {
    locale = 'en',
    hourFormat = '24',
    showSeconds = false,
    localeConfig,
  } = options;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let text;
  if (hourFormat === '12') {
    const { hour, period } = format12Hour(hours);
    text = `${pad(hour)}:${pad(minutes)}`;
    if (showSeconds) text += `:${pad(seconds)}`;
    text += ` ${localeConfig?.[period] ?? period}`;
  } else {
    text = `${pad(hours)}:${pad(minutes)}`;
    if (showSeconds) text += `:${pad(seconds)}`;
  }

  return formatLocaleText(text, locale);
}

export function formatRangeValue(values, dateFormat, options) {
  if (!Array.isArray(values) || !values.length) return '';
  return values.map((value) => formatDate(value, dateFormat, options)).join(' - ');
}

export function formatCalendarValue(value, options = {}) {
  const {
    selectionMode = 'single',
    dateFormat = 'mm/dd/yyyy',
    mode = 'date',
    timeOnly = false,
  } = options;

  if (mode === 'time' || timeOnly) {
    return formatTime(value, options);
  }

  if (selectionMode === 'multiple') {
    const values = Array.isArray(value) ? value : [];
    return values.map((item) => formatDate(item, dateFormat, options)).join(', ');
  }

  if (selectionMode === 'range') {
    return formatRangeValue(value, dateFormat, options);
  }

  const datePart = formatDate(value, dateFormat, options);
  if (mode === 'datetime' && datePart) {
    const timePart = formatTime(value, options);
    return timePart ? `${datePart} ${timePart}` : datePart;
  }

  return datePart;
}
