import { getFieldValue } from './getFieldValue.js';

export const FILTER_MATCH_MODES = {
  contains: 'contains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  equals: 'equals',
  notEquals: 'notEquals',
  lt: 'lt',
  lte: 'lte',
  gt: 'gt',
  gte: 'gte',
  in: 'in',
  between: 'between',
};

function normalizeFilterValue(value, dataType) {
  if (value == null || value === '') return value;
  if (dataType === 'numeric') return Number(value);
  if (dataType === 'boolean') return value === true || value === 'true';
  if (dataType === 'date') {
    return value instanceof Date ? value : new Date(value);
  }
  return value;
}

function matchesConstraint(cellValue, constraint, dataType = 'text') {
  const { value, matchMode = FILTER_MATCH_MODES.contains } = constraint;
  const filterValue = normalizeFilterValue(value, dataType);
  const targetValue = normalizeFilterValue(cellValue, dataType);

  if (filterValue == null || filterValue === '') return true;
  if (targetValue == null) return false;

  switch (matchMode) {
    case FILTER_MATCH_MODES.equals:
      return targetValue === filterValue;
    case FILTER_MATCH_MODES.notEquals:
      return targetValue !== filterValue;
    case FILTER_MATCH_MODES.startsWith:
      return String(targetValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case FILTER_MATCH_MODES.endsWith:
      return String(targetValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
    case FILTER_MATCH_MODES.lt:
      return targetValue < filterValue;
    case FILTER_MATCH_MODES.lte:
      return targetValue <= filterValue;
    case FILTER_MATCH_MODES.gt:
      return targetValue > filterValue;
    case FILTER_MATCH_MODES.gte:
      return targetValue >= filterValue;
    case FILTER_MATCH_MODES.in:
      return Array.isArray(filterValue) && filterValue.includes(targetValue);
    case FILTER_MATCH_MODES.between: {
      const [min, max] = Array.isArray(filterValue) ? filterValue : [null, null];
      if (min != null && targetValue < min) return false;
      if (max != null && targetValue > max) return false;
      return true;
    }
    case FILTER_MATCH_MODES.contains:
    default:
      return String(targetValue).toLowerCase().includes(String(filterValue).toLowerCase());
  }
}

function matchesColumnFilter(row, field, filterMeta, dataType) {
  if (!filterMeta) return true;

  const constraints = Array.isArray(filterMeta.constraints)
    ? filterMeta.constraints
    : [{ value: filterMeta.value, matchMode: filterMeta.matchMode }];

  const operator = filterMeta.operator || 'and';
  const cellValue = getFieldValue(row, field);
  const results = constraints.map((constraint) => matchesConstraint(cellValue, constraint, dataType));

  return operator === 'or' ? results.some(Boolean) : results.every(Boolean);
}

export function filterData(data, filters = {}, globalFilter, globalFilterFields = []) {
  if (!Array.isArray(data)) return [];

  const globalTerm = typeof globalFilter === 'string'
    ? globalFilter
    : filters?.global?.value;

  return data.filter((row) => {
    if (globalTerm) {
      const term = String(globalTerm).toLowerCase();
      const fields = globalFilterFields.length
        ? globalFilterFields
        : Object.keys(filters).filter((key) => key !== 'global');

      const globalMatch = fields.some((field) => {
        const value = getFieldValue(row, field);
        return value != null && String(value).toLowerCase().includes(term);
      });

      if (!globalMatch) return false;
    }

    return Object.entries(filters).every(([field, filterMeta]) => {
      if (field === 'global') return true;
      return matchesColumnFilter(row, field, filterMeta, filterMeta?.dataType);
    });
  });
}

export function createEmptyFilters(columns = []) {
  const filters = { global: { value: null, matchMode: FILTER_MATCH_MODES.contains } };
  columns.forEach((column) => {
    if (column.filter || column.filterField) {
      const field = column.filterField || column.field;
      filters[field] = {
        operator: 'and',
        constraints: [{ value: null, matchMode: FILTER_MATCH_MODES.contains }],
      };
    }
  });
  return filters;
}
