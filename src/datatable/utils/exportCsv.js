import { getFieldValue } from './getFieldValue.js';

function escapeCsvValue(value) {
  const text = value == null ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportDataAsCsv({
  data = [],
  columns = [],
  fileName = 'export',
} = {}) {
  const exportableColumns = columns.filter((column) => column.exportable !== false && (column.field || column.header));
  const headers = exportableColumns.map((column) => column.header || column.field || '');
  const rows = data.map((row) =>
    exportableColumns.map((column) => {
      if (typeof column.exportValue === 'function') {
        return column.exportValue(row);
      }
      if (column.field) {
        return getFieldValue(row, column.field);
      }
      return '';
    })
  );

  const csv = [headers, ...rows]
    .map((line) => line.map(escapeCsvValue).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
