const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toLocaleDigits(value, locale) {
  const text = String(value);
  if (locale === 'fa') return text.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
  if (locale === 'ar') return text.replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);
  return text;
}

const LOCALES = {
  en: {
    firstDayOfWeek: 0,
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    chooseDate: 'Choose Date',
    chooseMonth: 'Choose Month',
    chooseYear: 'Choose Year',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    prevYear: 'Previous Year',
    nextYear: 'Next Year',
    prevDecade: 'Previous Decade',
    nextDecade: 'Next Decade',
    am: 'AM',
    pm: 'PM',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    weekHeader: 'Wk',
    placeholder: 'Select date',
  },
  fa: {
    firstDayOfWeek: 6,
    dayNames: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
    dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
    dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
    monthNames: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    monthNamesShort: ['فر', 'ارد', 'خر', 'تیر', 'مر', 'شه', 'مه', 'آب', 'آذ', 'دی', 'به', 'اس'],
    today: 'امروز',
    clear: 'پاک کردن',
    chooseDate: 'انتخاب تاریخ',
    chooseMonth: 'انتخاب ماه',
    chooseYear: 'انتخاب سال',
    prevMonth: 'ماه قبل',
    nextMonth: 'ماه بعد',
    prevYear: 'سال قبل',
    nextYear: 'سال بعد',
    prevDecade: 'دهه قبل',
    nextDecade: 'دهه بعد',
    am: 'ق.ظ',
    pm: 'ب.ظ',
    hour: 'ساعت',
    minute: 'دقیقه',
    second: 'ثانیه',
    weekHeader: 'هفته',
    placeholder: 'انتخاب تاریخ',
  },
  ar: {
    firstDayOfWeek: 6,
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'],
    dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    monthNames: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    monthNamesShort: ['محرم', 'صفر', 'رب١', 'رب٢', 'جم١', 'جم٢', 'رجب', 'شعب', 'رمض', 'شوال', 'قعد', 'حج'],
    today: 'اليوم',
    clear: 'مسح',
    chooseDate: 'اختر التاريخ',
    chooseMonth: 'اختر الشهر',
    chooseYear: 'اختر السنة',
    prevMonth: 'الشهر السابق',
    nextMonth: 'الشهر التالي',
    prevYear: 'السنة السابقة',
    nextYear: 'السنة التالية',
    prevDecade: 'العقد السابق',
    nextDecade: 'العقد التالي',
    am: 'ص',
    pm: 'م',
    hour: 'ساعة',
    minute: 'دقيقة',
    second: 'ثانية',
    weekHeader: 'أسبوع',
    placeholder: 'اختر التاريخ',
  },
};

export function resolveLocale(locale, rtl) {
  if (locale && LOCALES[locale]) return locale;
  if (rtl) return 'fa';
  return 'en';
}

export function getLocaleConfig(locale = 'en') {
  return LOCALES[locale] ?? LOCALES.en;
}

export function formatLocaleText(value, locale) {
  return toLocaleDigits(value, locale);
}
