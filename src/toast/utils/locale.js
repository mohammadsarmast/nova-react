const LOCALES = {
  en: {
    close: 'Close',
  },
  fa: {
    close: 'بستن',
  },
  ar: {
    close: 'إغلاق',
  },
};

const RTL_LOCALES = new Set(['fa', 'ar']);

export function resolveToastLocale(locale, rtl) {
  if (locale && LOCALES[locale]) return locale;
  if (rtl) return 'fa';
  return 'en';
}

export function getToastLocaleConfig(locale = 'en') {
  return LOCALES[locale] ?? LOCALES.en;
}

export function isToastRtlLocale(locale) {
  return RTL_LOCALES.has(locale);
}
