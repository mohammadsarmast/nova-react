export function paginateData(data, first = 0, rows = 10) {
  if (!Array.isArray(data)) return [];
  return data.slice(first, first + rows);
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
