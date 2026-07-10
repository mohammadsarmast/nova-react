import { describe, expect, it } from 'vitest';
import { getItemBounds, resolveWorkspaceItems } from '../utils/items.js';

describe('resolveWorkspaceItems', () => {
  it('returns free-layout metadata and position', () => {
    const itemsMap = new Map([
      ['docs', { id: 'docs', layout: 'free', x: 10, y: 20, width: 100, height: 80, data: { label: 'Documents' } }],
      ['photo', { id: 'photo', layout: 'free', x: 140, y: 30, width: 90, height: 70, data: { label: 'Photos' } }],
    ]);

    const result = resolveWorkspaceItems(['docs', 'photo'], itemsMap, { docs: { x: 36, y: 42 } });

    expect(result).toEqual([
      {
        id: 'docs',
        layout: 'free',
        x: 36,
        y: 42,
        width: 100,
        height: 80,
        data: { label: 'Documents' },
      },
      {
        id: 'photo',
        layout: 'free',
        x: 140,
        y: 30,
        width: 90,
        height: 70,
        data: { label: 'Photos' },
      },
    ]);
  });

  it('reads flow-layout bounds from the DOM when available', () => {
    const container = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 50,
        width: 500,
        height: 300,
      }),
    };
    const element = {
      getBoundingClientRect: () => ({
        left: 132,
        top: 82,
        width: 120,
        height: 96,
      }),
    };
    const itemsMap = new Map([
      ['card', { id: 'card', layout: 'flow', data: { label: 'Card' }, element }],
    ]);

    expect(getItemBounds(itemsMap.get('card'), container)).toEqual({
      x: 32,
      y: 32,
      width: 120,
      height: 96,
    });

    expect(resolveWorkspaceItems(['card'], itemsMap, {}, container)).toEqual([
      {
        id: 'card',
        layout: 'flow',
        x: 32,
        y: 32,
        width: 120,
        height: 96,
        data: { label: 'Card' },
      },
    ]);
  });
});
