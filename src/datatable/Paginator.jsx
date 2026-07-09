import React from 'react';
import { cn } from './utils/cn.js';
import { formatNumber, formatTemplate } from './utils/locale.js';

function ChevronIcon({ direction = 'left' }) {
  const paths = {
    left: 'M12.78 15.53a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 111.06 1.06L9.06 11l3.72 3.47a.75.75 0 010 1.06z',
    right: 'M7.22 15.53a.75.75 0 001.06 0l4.25-4.25a.75.75 0 000-1.06L8.28 5.97a.75.75 0 10-1.06 1.06L10.94 11 7.22 14.47a.75.75 0 000 1.06z',
    doubleLeft: 'M11.03 3.97a.75.75 0 010 1.06l-3.22 3.22 3.22 3.22a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75zm4.5 0a.75.75 0 010 1.06l-3.22 3.22 3.22 3.22a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75z',
    doubleRight: 'M4.47 3.97a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l3.22-3.22-3.22-3.22a.75.75 0 010-1.06zm5 0a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l3.22-3.22-3.22-3.22a.75.75 0 010-1.06z',
  };

  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d={paths[direction]} />
    </svg>
  );
}

export function Paginator({
  first = 0,
  rows = 10,
  totalRecords = 0,
  rowsPerPageOptions = [5, 10, 25, 50],
  onPageChange,
  onRowsChange,
  template = 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
  currentPageReportTemplate = '{first} to {last} of {totalRecords}',
  left,
  right,
  rtl = false,
  locale = 'en',
  labels = {},
  className,
}) {
  const pageCount = rows > 0 ? Math.ceil(totalRecords / rows) : 0;
  const page = rows > 0 ? Math.floor(first / rows) : 0;
  const last = totalRecords === 0 ? 0 : Math.min(first + rows, totalRecords);
  const displayFirst = totalRecords === 0 ? 0 : first + 1;

  const goToPage = (nextPage) => {
    const safePage = Math.max(0, Math.min(nextPage, Math.max(pageCount - 1, 0)));
    onPageChange?.({
      first: safePage * rows,
      rows,
      page: safePage,
      pageCount,
      totalRecords,
    });
  };

  const parts = template.split(' ').filter(Boolean);
  const report = formatTemplate(currentPageReportTemplate, {
    first: formatNumber(displayFirst, locale),
    last: formatNumber(last, locale),
    totalRecords: formatNumber(totalRecords, locale),
  });

  const renderPart = (part) => {
    switch (part) {
      case 'FirstPageLink':
        return (
          <button
            key={part}
            type="button"
            className="nr-paginator__btn"
            onClick={() => goToPage(0)}
            disabled={page <= 0}
            aria-label={labels.firstPage || 'First page'}
          >
            <ChevronIcon direction={rtl ? 'doubleRight' : 'doubleLeft'} />
          </button>
        );
      case 'PrevPageLink':
        return (
          <button
            key={part}
            type="button"
            className="nr-paginator__btn"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 0}
            aria-label={labels.previousPage || 'Previous page'}
          >
            <ChevronIcon direction={rtl ? 'right' : 'left'} />
          </button>
        );
      case 'NextPageLink':
        return (
          <button
            key={part}
            type="button"
            className="nr-paginator__btn"
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label={labels.nextPage || 'Next page'}
          >
            <ChevronIcon direction={rtl ? 'left' : 'right'} />
          </button>
        );
      case 'LastPageLink':
        return (
          <button
            key={part}
            type="button"
            className="nr-paginator__btn"
            onClick={() => goToPage(pageCount - 1)}
            disabled={page >= pageCount - 1}
            aria-label={labels.lastPage || 'Last page'}
          >
            <ChevronIcon direction={rtl ? 'doubleLeft' : 'doubleRight'} />
          </button>
        );
      case 'PageLinks': {
        const pages = [];
        const maxLinks = 5;
        let start = Math.max(0, page - Math.floor(maxLinks / 2));
        let end = Math.min(pageCount, start + maxLinks);
        start = Math.max(0, end - maxLinks);

        for (let index = start; index < end; index += 1) {
          pages.push(
            <button
              key={`page-${index}`}
              type="button"
              className={cn('nr-paginator__btn', 'nr-paginator__page', index === page && 'nr-paginator__page--active')}
              onClick={() => goToPage(index)}
              aria-current={index === page ? 'page' : undefined}
            >
              {formatNumber(index + 1, locale)}
            </button>
          );
        }
        return <div key={part} className="nr-paginator__pages">{pages}</div>;
      }
      case 'RowsPerPageDropdown':
        return (
          <label key={part} className="nr-paginator__rows">
            <span className="nr-paginator__rows-label">{labels.rowsPerPage || 'Rows'}</span>
            <select
              className="nr-paginator__select"
              value={rows}
              onChange={(event) => {
                const nextRows = Number(event.target.value);
                onRowsChange?.({
                  first: 0,
                  rows: nextRows,
                  page: 0,
                  pageCount: Math.ceil(totalRecords / nextRows),
                  totalRecords,
                });
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {formatNumber(option, locale)}
                </option>
              ))}
            </select>
          </label>
        );
      case 'CurrentPageReport':
        return <span key={part} className="nr-paginator__report">{report}</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cn('nr-paginator', rtl && 'nr-paginator--rtl', className)}>
      {left ? <div className="nr-paginator__slot nr-paginator__slot--left">{left}</div> : null}
      <div className="nr-paginator__center">{parts.map(renderPart)}</div>
      {right ? <div className="nr-paginator__slot nr-paginator__slot--right">{right}</div> : null}
    </div>
  );
}
