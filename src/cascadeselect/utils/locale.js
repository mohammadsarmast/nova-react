const LOCALES = {
  en: {
    placeholder: 'Select',
    emptyMessage: 'No options available',
    ariaLabel: 'Cascade select',
  },
  fa: {
    placeholder: 'انتخاب کنید',
    emptyMessage: 'گزینه‌ای موجود نیست',
    ariaLabel: 'انتخاب آبشاری',
  },
  ar: {
    placeholder: 'اختر',
    emptyMessage: 'لا توجد خيارات',
    ariaLabel: 'اختيار متسلسل',
  },
};

const RTL_LOCALES = new Set(['fa', 'ar']);

export function resolveCascadeSelectLocale(locale, rtl) {
  if (locale && LOCALES[locale]) return locale;
  if (rtl) return 'fa';
  return 'en';
}

export function getCascadeSelectLocaleConfig(locale = 'en') {
  return LOCALES[locale] ?? LOCALES.en;
}

export function isCascadeSelectRtlLocale(locale) {
  return RTL_LOCALES.has(locale);
}
