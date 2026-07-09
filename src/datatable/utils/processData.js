import { sortData } from './sort.js';
import { filterData } from './filter.js';
import { paginateData } from './paginate.js';

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
    };
  }

  const filtered = filterData(value, filters, globalFilter, globalFilterFields);
  const sorted = sortData(filtered, { sortField, sortOrder, multiSortMeta });
  const total = sorted.length;
  const rowsData = paginator ? paginateData(sorted, first, rows) : sorted;

  return {
    rows: rowsData,
    totalRecords: total,
  };
}
