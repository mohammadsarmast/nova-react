import { describe, expect, it } from 'vitest';
import {
  createCreatableOption,
  createMatchFilter,
  filterOptions,
  getOptionLabel,
  isCreatableOption,
  isOptionDisabled,
} from '../utils/index.js';
import { highlightText } from '../utils/highlight.jsx';

describe('autocomplete utils', () => {
  it('gets option label from string and object', () => {
    expect(getOptionLabel('Iran')).toBe('Iran');
    expect(getOptionLabel({ name: 'Iran', code: 'IR' }, 'name')).toBe('Iran');
  });

  it('filters with contains match mode', () => {
    const items = ['Germany', 'Iran', 'France'];
    expect(filterOptions(items, 'ger', null, createMatchFilter('contains'))).toEqual(['Germany']);
  });

  it('filters with startsWith match mode', () => {
    const items = ['Germany', 'Iran', 'France'];
    expect(filterOptions(items, 'Ge', null, createMatchFilter('startsWith'))).toEqual(['Germany']);
  });

  it('detects disabled options', () => {
    expect(isOptionDisabled({ name: 'A', disabled: true })).toBe(true);
    expect(isOptionDisabled({ name: 'A' })).toBe(false);
  });

  it('creates creatable option marker', () => {
    const item = createCreatableOption('custom');
    expect(isCreatableOption(item)).toBe(true);
    expect(item.value).toBe('custom');
  });
});

describe('highlightText', () => {
  it('highlights matching text without regex state bug', () => {
    const result = highlightText('Germany Germany', 'ger');
    expect(result).toBeTruthy();
  });
});
