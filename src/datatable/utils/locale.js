const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const enLocale = {
  aria: {
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    sortNone: 'Not sorted',
    selectRow: 'Select row',
    unselectRow: 'Unselect row',
    selectAll: 'Select all rows',
    unselectAll: 'Unselect all rows',
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    showFilterMenu: 'Show filter menu',
    hideFilterMenu: 'Hide filter menu',
    filter: 'Filter',
    clear: 'Clear',
    apply: 'Apply',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    rowsPerPage: 'Rows per page',
    globalSearch: 'Global search',
    loading: 'Loading...',
    emptyMessage: 'No results found',
    resizeColumn: 'Resize column',
  },
  paginator: {
    currentPageReport: '{first} to {last} of {totalRecords}',
    showingReport: 'Showing {first} to {last} of {totalRecords} entries',
  },
  search: {
    placeholder: 'Search...',
  },
};

const faLocale = {
  aria: {
    sortAscending: 'مرتب‌سازی صعودی',
    sortDescending: 'مرتب‌سازی نزولی',
    sortNone: 'بدون مرتب‌سازی',
    selectRow: 'انتخاب ردیف',
    unselectRow: 'لغو انتخاب ردیف',
    selectAll: 'انتخاب همه ردیف‌ها',
    unselectAll: 'لغو انتخاب همه',
    expandRow: 'باز کردن ردیف',
    collapseRow: 'بستن ردیف',
    showFilterMenu: 'نمایش منوی فیلتر',
    hideFilterMenu: 'پنهان کردن منوی فیلتر',
    filter: 'فیلتر',
    clear: 'پاک کردن',
    apply: 'اعمال',
    firstPage: 'صفحه اول',
    previousPage: 'صفحه قبل',
    nextPage: 'صفحه بعد',
    lastPage: 'صفحه آخر',
    rowsPerPage: 'تعداد در هر صفحه',
    globalSearch: 'جستجو',
    loading: 'در حال بارگذاری...',
    emptyMessage: 'موردی یافت نشد',
    resizeColumn: 'تغییر اندازه ستون',
  },
  paginator: {
    currentPageReport: '{first} تا {last} از {totalRecords}',
    showingReport: 'نمایش {first} تا {last} از {totalRecords} مورد',
  },
  search: {
    placeholder: 'جستجو...',
  },
};

export function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function resolveLocale(rtl, locale) {
  if (locale) return locale;
  return rtl ? 'fa' : 'en';
}

export function resolveDataTableLocale(locale = 'en') {
  return locale === 'fa' ? faLocale : enLocale;
}

export function formatNumber(value, locale) {
  if (locale !== 'fa') return String(value);
  return toPersianDigits(value);
}

export const defaultLocale = enLocale;

export function formatTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    return value == null ? '' : String(value);
  });
}
