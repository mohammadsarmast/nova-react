import { sortData } from './sort.js';
import { filterData } from './filter.js';
import { paginateData, clampFirst } from './paginate.js';

export function processTableData({
  value = [],
  lazy = false,
  paginator = false,
  first = 0,
  rows = 10,
  totalRecords,
  sortField,
  sortOrder,
  multiSortMeta = [],
  filters = {},
  globalFilter,
  globalFilterFields = [],
}) {
  if (lazy) {
    return {
      rows: Array.isArray(value) ? value : [],
      totalRecords: totalRecords ?? value?.length ?? 0,
      allRows: Array.isArray(value) ? value : [],
    };
  }

  const filtered = filterData(value, filters, globalFilter, globalFilterFields);
  const sorted = sortData(filtered, { sortField, sortOrder, multiSortMeta });
  const total = sorted.length;
  const safeFirst = paginator ? clampFirst(first, rows, total) : first;
  const rowsData = paginator ? paginateData(sorted, safeFirst, rows) : sorted;

  return {
    rows: rowsData,
    totalRecords: total,
    allRows: sorted,
    first: safeFirst,
  };
}
