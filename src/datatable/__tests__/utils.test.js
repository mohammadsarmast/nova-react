import { describe, expect, it } from 'vitest';
import { filterData, FILTER_MATCH_MODES } from '../utils/filter.js';
import { paginateData } from '../utils/paginate.js';
import { processTableData } from '../utils/processData.js';
import { sortData } from '../utils/sort.js';
import { getFieldValue } from '../utils/getFieldValue.js';

const sample = [
  { id: 1, name: 'Alpha', category: 'A', quantity: 10, country: { name: 'USA' } },
  { id: 2, name: 'Beta', category: 'B', quantity: 5, country: { name: 'UK' } },
  { id: 3, name: 'Gamma', category: 'A', quantity: 20, country: { name: 'Japan' } },
];

describe('datatable field utils', () => {
  it('reads nested field values', () => {
    expect(getFieldValue(sample[0], 'country.name')).toBe('USA');
  });
});

describe('datatable sort', () => {
  it('sorts by field ascending and descending', () => {
    const asc = sortData(sample, { sortField: 'quantity', sortOrder: 1 });
    expect(asc.map((row) => row.id)).toEqual([2, 1, 3]);
    const desc = sortData(sample, { sortField: 'quantity', sortOrder: -1 });
    expect(desc.map((row) => row.id)).toEqual([3, 1, 2]);
  });
});

describe('datatable filter', () => {
  it('filters rows by column and global term', () => {
    const filtered = filterData(sample, {
      name: { constraints: [{ value: 'lph', matchMode: FILTER_MATCH_MODES.contains }] },
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Alpha');

    const globalFiltered = filterData(sample, {}, 'gamma', ['name', 'category']);
    expect(globalFiltered).toHaveLength(1);
    expect(globalFiltered[0].name).toBe('Gamma');
  });
});

describe('datatable paginate', () => {
  it('slices rows for client pagination', () => {
    expect(paginateData(sample, 1, 2).map((row) => row.id)).toEqual([2, 3]);
  });
});

describe('datatable process data', () => {
  it('processes client-side data with sort filter and paginate', () => {
    const result = processTableData({
      value: sample,
      paginator: true,
      first: 0,
      rows: 2,
      sortField: 'name',
      sortOrder: 1,
      filters: {
        category: { constraints: [{ value: 'A', matchMode: FILTER_MATCH_MODES.equals }] },
      },
    });

    expect(result.totalRecords).toBe(2);
    expect(result.rows.map((row) => row.name)).toEqual(['Alpha', 'Gamma']);
  });

  it('returns server rows as-is in lazy mode', () => {
    const serverRows = [{ id: 9, name: 'Server' }];
    const result = processTableData({
      value: serverRows,
      lazy: true,
      paginator: true,
      first: 10,
      rows: 5,
      totalRecords: 120,
    });

    expect(result.rows).toEqual(serverRows);
    expect(result.totalRecords).toBe(120);
  });
});
