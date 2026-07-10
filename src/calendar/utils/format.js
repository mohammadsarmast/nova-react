import { toCalendarParts } from './calendarDate.js';
import { formatLocaleText } from './locale.js';

const TOKEN_REGEX = /d{1,2}|M{1,4}|y{2,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|a|p|@|!/g;

function pad(value, size = 2) {
  return String(value).padStart(size, '0');
}

function format12Hour(hours) {
  const period = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12 || 12;
  return { hour, period };
}

export function formatDate(date, dateFormat = 'mm/dd/yy', options = {}) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

  const {
    calendarSystem = 'gregorian',
    locale = 'en',
    hourFormat = '24',
    localeConfig,
  } = options;

  const parts = toCalendarParts(date, calendarSystem);
  if (!parts) return '';

  const monthName = localeConfig?.monthNames?.[parts.month - 1] ?? '';
  const monthShort = localeConfig?.monthNamesShort?.[parts.month - 1] ?? monthName.slice(0, 3);
  const { hour: hour12, period } = format12Hour(parts.hours);

  const tokens = {
    d: String(parts.day),
    dd: pad(parts.day),
    M: String(parts.month),
    MM: pad(parts.month),
    MMM: monthShort,
    MMMM: monthName,
    yy: pad(parts.year % 100),
    yyyy: String(parts.year),
    H: String(parts.hours),
    HH: pad(parts.hours),
    h: String(hour12),
    hh: pad(hour12),
    m: String(parts.minutes),
    mm: pad(parts.minutes),
    s: String(parts.seconds),
    ss: pad(parts.seconds),
    a: localeConfig?.[period] ?? period,
    p: localeConfig?.[period] ?? period,
    '@': String(date.getTime()),
    '!': String(date.getTime()),
  };

  const formatted = dateFormat.replace(TOKEN_REGEX, (token) => {
    if ((token === 'h' || token === 'hh') && hourFormat === '24') {
      return tokens.HH;
    }
    if ((token === 'a' || token === 'p') && hourFormat === '24') {
      return '';
    }
    return tokens[token] ?? token;
  }).replace(/\s+/g, ' ').trim();

  return formatLocaleText(formatted, locale);
}

export function formatRangeValue(values, dateFormat, options) {
  if (!Array.isArray(values) || !values.length) return '';
  return values.map((value) => formatDate(value, dateFormat, options)).join(' - ');
}

export function formatCalendarValue(value, options = {}) {
  const {
    selectionMode = 'single',
    dateFormat = 'mm/dd/yy',
    mode = 'date',
    timeOnly = false,
  } = options;

  const effectiveFormat = timeOnly ? (options.timeFormat ?? 'HH:mm') : dateFormat;

  if (selectionMode === 'multiple') {
    const values = Array.isArray(value) ? value : [];
    return values.map((item) => formatDate(item, effectiveFormat, options)).join(', ');
  }

  if (selectionMode === 'range') {
    return formatRangeValue(value, effectiveFormat, options);
  }

  if (mode === 'time' || timeOnly) {
    return formatDate(value, effectiveFormat, options);
  }

  return formatDate(value, effectiveFormat, options);
}
