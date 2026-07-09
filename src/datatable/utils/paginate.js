export function paginateData(data, first = 0, rows = 10) {
  if (!Array.isArray(data)) return [];
  return data.slice(first, first + rows);
}

export function clampFirst(first = 0, rows = 10, totalRecords = 0) {
  if (!rows || rows <= 0 || totalRecords <= 0) return 0;
  const maxFirst = Math.max(0, (Math.ceil(totalRecords / rows) - 1) * rows);
  return Math.min(first, maxFirst);
}

export function getPageCount(totalRecords, rows) {
  if (!rows || rows <= 0) return 0;
  return Math.ceil(totalRecords / rows);
}

export function getPageFromFirst(first, rows) {
  if (!rows || rows <= 0) return 0;
  return Math.floor(first / rows);
}

export function createPageEvent({ first, rows, page, pageCount, totalRecords }) {
  return {
    first,
    rows,
    page,
    pageCount,
    totalRecords,
  };
}
