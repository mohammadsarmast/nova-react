import { describe, expect, it } from 'vitest';
import {
  getCascadeSelectLocaleConfig,
  isCascadeSelectRtlLocale,
  resolveCascadeSelectLocale,
} from '../utils/locale.js';

describe('cascadeselect locale', () => {
  it('resolves fa when rtl is true', () => {
    expect(resolveCascadeSelectLocale(undefined, true)).toBe('fa');
  });

  it('returns Persian strings for fa locale', () => {
    const config = getCascadeSelectLocaleConfig('fa');
    expect(config.placeholder).toBe('انتخاب کنید');
    expect(isCascadeSelectRtlLocale('fa')).toBe(true);
  });
});
