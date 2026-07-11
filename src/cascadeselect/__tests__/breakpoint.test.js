import { describe, expect, it } from 'vitest';
import { normalizeBreakpoint } from '../utils/breakpoint.js';

describe('normalizeBreakpoint', () => {
  it('returns null for falsy values', () => {
    expect(normalizeBreakpoint(null)).toBeNull();
    expect(normalizeBreakpoint(false)).toBeNull();
    expect(normalizeBreakpoint(undefined)).toBeNull();
  });

  it('normalizes numeric breakpoints to px', () => {
    expect(normalizeBreakpoint(767)).toBe('767px');
  });

  it('keeps string breakpoints as-is', () => {
    expect(normalizeBreakpoint('767px')).toBe('767px');
    expect(normalizeBreakpoint('48rem')).toBe('48rem');
  });
});
