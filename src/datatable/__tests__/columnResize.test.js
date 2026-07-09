import { describe, expect, it, vi } from 'vitest';
import { clampColumnWidth, getColumnResizeKey, isColumnResizable } from '../utils/columnResize.js';

describe('datatable column resize utils', () => {
  it('detects resizable columns and clamps width', () => {
    expect(isColumnResizable({ field: 'name' }, true)).toBe(true);
    expect(isColumnResizable({ field: 'name', resizable: false }, true)).toBe(false);
    expect(isColumnResizable({ field: 'name' }, false)).toBe(false);
    expect(clampColumnWidth(40, 80, 200)).toBe(80);
    expect(clampColumnWidth(500, 80, 200)).toBe(200);
    expect(getColumnResizeKey({ field: 'code' }, 0)).toBe('code');
  });
});
