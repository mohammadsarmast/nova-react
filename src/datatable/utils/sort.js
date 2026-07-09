import { getFieldValue } from './getFieldValue.js';

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function sortData(data, { sortField, sortOrder = 1, multiSortMeta = [] }) {
  if (!Array.isArray(data) || !data.length) return data;

  const sortMetas = multiSortMeta.length
    ? multiSortMeta
    : sortField
      ? [{ field: sortField, order: sortOrder }]
      : [];

  if (!sortMetas.length) return [...data];

  return [...data].sort((left, right) => {
    for (const meta of sortMetas) {
      const leftValue = getFieldValue(left, meta.field);
      const rightValue = getFieldValue(right, meta.field);
      const result = compareValues(leftValue, rightValue);
      if (result !== 0) {
        return (meta.order ?? 1) * result;
      }
    }
    return 0;
  });
}

export function getNextSingleSortState({ field, sortField, sortOrder, removableSort }) {
  if (sortField !== field) {
    return { sortField: field, sortOrder: 1 };
  }

  if (sortOrder === 1) {
    return { sortField: field, sortOrder: -1 };
  }

  if (removableSort) {
    return { sortField: null, sortOrder: null };
  }

  return { sortField: field, sortOrder: 1 };
}

export function getNextMultiSortState({ field, multiSortMeta, removableSort }) {
  const current = [...(multiSortMeta || [])];
  const index = current.findIndex((item) => item.field === field);

  if (index === -1) {
    current.push({ field, order: 1 });
    return current;
  }

  const nextOrder = current[index].order === 1 ? -1 : removableSort ? null : 1;
  if (nextOrder == null) {
    current.splice(index, 1);
    return current;
  }

  current[index] = { field, order: nextOrder };
  return current;
}
