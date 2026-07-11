import { describe, expect, it } from 'vitest';
import {
  getToastLocaleConfig,
  isToastRtlLocale,
  resolveToastLocale,
} from '../utils/locale.js';

describe('toast locale', () => {
  it('resolves fa when rtl is true', () => {
    expect(resolveToastLocale(undefined, true)).toBe('fa');
  });

  it('returns Persian close label for fa locale', () => {
    const config = getToastLocaleConfig('fa');
    expect(config.close).toBe('بستن');
    expect(isToastRtlLocale('fa')).toBe(true);
  });
});
