import { describe, expect, it } from 'vitest';
import { getCustomColorVars, hexToRgb, normalizeColorToHex, shadeHex } from '../utils/color.js';

describe('color utils', () => {
  it('converts hex to rgb', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('normalizes rgb and hsl colors to hex', () => {
    expect(normalizeColorToHex('rgb(139, 92, 246)')).toBe('#8b5cf6');
    expect(normalizeColorToHex('hsl(262, 83%, 58%)')).toBe('#7c3bed');
  });

  it('shades hex colors darker', () => {
    const shaded = shadeHex('#ffffff', 0.5);
    expect(shaded).toBe('#808080');
  });

  it('returns custom CSS vars from hex color prop', () => {
    const vars = getCustomColorVars('#3b82f6');
    expect(vars).toMatchObject({
      '--nr-btn-primary': '#3b82f6',
    });
    expect(vars['--nr-btn-primary-hover']).toBeTruthy();
    expect(vars['--nr-btn-gradient']).toContain('linear-gradient');
  });

  it('returns custom CSS vars from rgb color prop', () => {
    const vars = getCustomColorVars('rgb(59, 130, 246)');
    expect(vars['--nr-btn-primary']).toBe('#3b82f6');
    expect(vars['--nr-btn-primary-hover']).toBe('#3472d8');
  });

  it('falls back safely for unsupported color strings', () => {
    const vars = getCustomColorVars('var(--brand)');
    expect(vars['--nr-btn-primary']).toBe('var(--brand)');
    expect(vars['--nr-btn-primary-hover']).toBe('var(--brand)');
  });

  it('returns null when color is empty', () => {
    expect(getCustomColorVars()).toBeNull();
    expect(getCustomColorVars('')).toBeNull();
  });
});
