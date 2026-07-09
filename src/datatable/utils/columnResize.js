export function getColumnResizeKey(column, index) {
  return column.field || column.filterField || column.sortField || `col-${index}`;
}

export function isColumnResizable(column, tableResizable) {
  if (!tableResizable) return false;
  return column.resizable !== false && column.resizeable !== false;
}

export function clampColumnWidth(width, minWidth = 48, maxWidth) {
  const safeMin = Math.max(24, minWidth);
  let next = Math.max(safeMin, width);
  if (maxWidth != null) next = Math.min(maxWidth, next);
  return Math.round(next);
}

export function mergeWidthStyle(baseStyle, widthStyle) {
  if (!widthStyle || Object.keys(widthStyle).length === 0) return baseStyle;
  return { ...baseStyle, ...widthStyle };
}
