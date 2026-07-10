import { describe, expect, it } from 'vitest';
import {
  applyItemSelection,
  applyMarqueeSelection,
  getMarqueeHitIds,
} from '../utils/selection.js';

describe('workspace selection utils', () => {
  it('removes selected item with alt+click and adds with shift+click', () => {
    expect(applyItemSelection(['a', 'b'], 'b', { altKey: true })).toEqual(['a']);
    expect(applyItemSelection(['a'], 'b', { shiftKey: true })).toEqual(['a', 'b']);
    expect(applyItemSelection(['a'], 'a', { shiftKey: true })).toEqual(['a']);
  });

  it('replaces selection on plain click and toggles with ctrl', () => {
    expect(applyItemSelection(['a', 'b'], 'c', {})).toEqual(['c']);
    expect(applyItemSelection(['a'], 'b', { ctrlKey: true })).toEqual(['a', 'b']);
    expect(applyItemSelection(['a', 'b'], 'b', { ctrlKey: true })).toEqual(['a']);
  });

  it('selects items inside marquee and merges with ctrl', () => {
    const items = [
      { id: 'a', x: 10, y: 10, width: 40, height: 40 },
      { id: 'b', x: 100, y: 100, width: 40, height: 40 },
    ];

    const hitIds = getMarqueeHitIds(items, { left: 0, top: 0, width: 80, height: 80 });
    expect(hitIds).toEqual(['a']);
    expect(applyMarqueeSelection([], hitIds, {})).toEqual(['a']);
    expect(applyMarqueeSelection(['x'], hitIds, { ctrlKey: true })).toEqual(['x', 'a']);
  });
});
