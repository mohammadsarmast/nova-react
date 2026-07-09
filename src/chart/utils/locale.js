const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function resolveLocale(rtl, locale) {
  if (locale) return locale;
  return rtl ? 'fa' : 'en';
}

export function createAxisTickFormatter(locale) {
  if (locale !== 'fa') return undefined;
  return (value) => toPersianDigits(value);
}

export function createTooltipLabelFormatter(locale, indexAxis = 'x', chartType = 'bar') {
  if (locale !== 'fa') return undefined;
  return (context) => {
    const label = context.dataset.label || '';
    const parsed = context.parsed;
    let raw;
    if (chartType === 'radar') {
      raw = parsed?.r ?? context.raw;
    } else if (indexAxis === 'y') {
      raw = parsed?.x ?? context.raw;
    } else {
      raw = parsed?.y ?? parsed?.x ?? context.raw;
    }
    const value = raw == null ? '' : toPersianDigits(raw);
    return label ? `${label}: ${value}` : `${value}`;
  };
}
