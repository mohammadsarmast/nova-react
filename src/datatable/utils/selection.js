import { getFieldValue } from './getFieldValue.js';

export function getRowKey(row, dataKey, index) {
  if (dataKey != null) {
    const value = getFieldValue(row, dataKey);
    if (value != null) return value;
  }
  return index;
}

export function getRowStateKey(row, dataKey, rowIndex, { frozen = false } = {}) {
  const base = dataKey != null ? getFieldValue(row, dataKey) : JSON.stringify(row);
  return frozen ? `frozen:${base}` : String(base);
}

export function getReactRowKey(row, dataKey, rowIndex, { frozen = false } = {}) {
  const base = dataKey != null ? getFieldValue(row, dataKey) : rowIndex;
  return frozen ? `frozen-${base}` : `row-${base}`;
}

export function isRowSelected(row, selection, { selectionMode, dataKey }) {
  if (selection == null) return false;

  if (selectionMode === 'single' || selectionMode === 'radiobutton') {
    if (dataKey) return getFieldValue(selection, dataKey) === getFieldValue(row, dataKey);
    return selection === row;
  }

  if (!Array.isArray(selection)) return false;
  if (dataKey) {
    const rowKey = getFieldValue(row, dataKey);
    return selection.some((item) => getFieldValue(item, dataKey) === rowKey);
  }
  return selection.includes(row);
}

export function toggleRowSelection(row, selection, { selectionMode, dataKey, metaKeySelection }, metaKey = false) {
  if (selectionMode === 'single' || selectionMode === 'radiobutton') {
    if (isRowSelected(row, selection, { selectionMode, dataKey })) {
      return metaKeySelection && metaKey ? null : selection;
    }
    return row;
  }

  const current = Array.isArray(selection) ? [...selection] : [];
  const selected = isRowSelected(row, current, { selectionMode: 'multiple', dataKey });

  if (selected) {
    if (dataKey) {
      const rowKey = getFieldValue(row, dataKey);
      return current.filter((item) => getFieldValue(item, dataKey) !== rowKey);
    }
    return current.filter((item) => item !== row);
  }

  if (metaKeySelection && !metaKey) {
    return [row];
  }

  return [...current, row];
}

export function toggleAllSelection(rows, selection, dataKey, checked) {
  if (!checked) return [];

  if (dataKey) {
    const keys = new Set(rows.map((row) => getFieldValue(row, dataKey)));
    const preserved = Array.isArray(selection)
      ? selection.filter((item) => !keys.has(getFieldValue(item, dataKey)))
      : [];
    return [...preserved, ...rows];
  }

  return [...rows];
}

export function getSelectionData(selection) {
  if (selection == null) return null;
  return selection;
}

export function isAllPageSelected(rows, selection, dataKey) {
  if (!rows.length || !Array.isArray(selection)) return false;
  return rows.every((row) => isRowSelected(row, selection, { selectionMode: 'multiple', dataKey }));
}
