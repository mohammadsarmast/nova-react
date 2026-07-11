import { describe, expect, it } from 'vitest';
import {
  findSelectedLabel,
  getChildOptions,
  getOptionLabelValue,
  getOptionValue,
  isGroupOption,
  normalizeGroupChildren,
} from '../utils/options.js';

const countries = [
  {
    name: 'USA',
    states: [
      {
        name: 'California',
        cities: [
          { cname: 'Los Angeles', code: 'LA' },
          { cname: 'San Francisco', code: 'SF' },
        ],
      },
    ],
  },
];

const config = {
  optionLabel: 'cname',
  optionGroupLabel: 'name',
  optionGroupChildren: ['states', 'cities'],
  optionValue: 'code',
};

describe('cascadeselect options utils', () => {
  it('normalizes optionGroupChildren', () => {
    expect(normalizeGroupChildren(['states', 'cities'])).toEqual(['states', 'cities']);
    expect(normalizeGroupChildren('states')).toEqual(['states']);
    expect(normalizeGroupChildren()).toEqual([]);
  });

  it('detects group options by level', () => {
    expect(isGroupOption(countries[0], 0, ['states', 'cities'])).toBe(true);
    expect(isGroupOption(countries[0].states[0], 1, ['states', 'cities'])).toBe(true);
    expect(isGroupOption(countries[0].states[0].cities[0], 2, ['states', 'cities'])).toBe(false);
  });

  it('returns child options for each level', () => {
    expect(getChildOptions(countries[0], 0, ['states', 'cities'])).toHaveLength(1);
    expect(getChildOptions(countries[0].states[0], 1, ['states', 'cities'])).toHaveLength(2);
  });

  it('reads labels for groups and leaves', () => {
    expect(getOptionLabelValue(countries[0], true, 'cname', 'name')).toBe('USA');
    expect(getOptionLabelValue(countries[0].states[0].cities[0], false, 'cname', 'name')).toBe('Los Angeles');
  });

  it('reads option values', () => {
    const city = countries[0].states[0].cities[0];
    expect(getOptionValue(city, 'code')).toBe('LA');
    expect(getOptionValue(city)).toEqual(city);
  });

  it('finds selected label by value', () => {
    expect(findSelectedLabel(countries, 'SF', config)).toBe('San Francisco');
    expect(findSelectedLabel(countries, 'XX', config)).toBeNull();
  });
});
