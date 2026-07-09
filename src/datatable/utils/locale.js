const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function resolveLocale(rtl, locale) {
  if (locale) return locale;
  return rtl ? 'fa' : 'en';
}

export function formatNumber(value, locale) {
  if (locale !== 'fa') return String(value);
  return toPersianDigits(value);
}

export const defaultLocale = {
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
  },
  paginator: {
    currentPageReport: '{first} to {last} of {totalRecords}',
    showingReport: 'Showing {first} to {last} of {totalRecords} entries',
  },
};

export function formatTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    return value == null ? '' : String(value);
  });
}
