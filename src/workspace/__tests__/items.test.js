import { describe, expect, it } from 'vitest';
import { resolveWorkspaceItems } from '../utils/items.js';

describe('resolveWorkspaceItems', () => {
  it('returns full item details for selected ids', () => {
    const itemsMap = new Map([
      ['docs', { id: 'docs', x: 10, y: 20, width: 100, height: 80, data: { label: 'Documents' } }],
      ['photo', { id: 'photo', x: 140, y: 30, width: 90, height: 70, data: { label: 'Photos' } }],
    ]);

    const result = resolveWorkspaceItems(['docs', 'photo'], itemsMap, { docs: { x: 36, y: 42 } });

    expect(result).toEqual([
      {
        id: 'docs',
        x: 36,
        y: 42,
        width: 100,
        height: 80,
        data: { label: 'Documents' },
      },
      {
        id: 'photo',
        x: 140,
        y: 30,
        width: 90,
        height: 70,
        data: { label: 'Photos' },
      },
    ]);
  });
});
