import { describe, expect, it } from 'vitest';
import {
  createAxisTickFormatter,
  createTooltipLabelFormatter,
  resolveLocale,
  toPersianDigits,
} from '../utils/locale.js';

describe('chart locale', () => {
  it('converts digits to persian', () => {
    expect(toPersianDigits('1403')).toBe('۱۴۰۳');
    expect(toPersianDigits(42)).toBe('۴۲');
  });

  it('resolves locale from rtl flag', () => {
    expect(resolveLocale(true)).toBe('fa');
    expect(resolveLocale(false)).toBe('en');
    expect(resolveLocale(true, 'en')).toBe('en');
  });

  it('formats axis ticks in persian locale', () => {
    const formatter = createAxisTickFormatter('fa');
    expect(formatter(80)).toBe('۸۰');
  });

  it('formats horizontal bar tooltip values from the value axis', () => {
    const formatter = createTooltipLabelFormatter('fa', 'y');
    expect(formatter({
      dataset: { label: 'فروش' },
      parsed: { x: 42, y: 0 },
      raw: 42,
    })).toBe('فروش: ۴۲');
  });
});
