import { describe, expect, it } from 'vitest';
import {
  resolveHorizontalPlacement,
  resolvePanelPlacement,
  resolveSublistPlacement,
} from '../utils/overlay.js';

function rect(left, right) {
  return { left, right, top: 0, bottom: 0, width: right - left, height: 0 };
}

describe('resolveHorizontalPlacement', () => {
  it('prefers forward in LTR when space is available to the right', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(100, 200),
        overlayWidth: 150,
        viewportWidth: 400,
        rtl: false,
      })
    ).toBe('forward');
  });

  it('flips backward in LTR when sublist would overflow right edge', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(300, 380),
        overlayWidth: 180,
        viewportWidth: 400,
        rtl: false,
      })
    ).toBe('backward');
  });

  it('picks side with more space in LTR when neither fits', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(250, 320),
        overlayWidth: 300,
        viewportWidth: 400,
        rtl: false,
      })
    ).toBe('backward');
  });

  it('prefers forward in RTL when sublist fits to the left', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(220, 280),
        overlayWidth: 150,
        viewportWidth: 400,
        rtl: true,
      })
    ).toBe('forward');
  });

  it('flips backward in RTL when sublist would overflow left edge', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(10, 100),
        overlayWidth: 180,
        viewportWidth: 400,
        rtl: true,
      })
    ).toBe('backward');
  });
});

describe('resolveSublistPlacement', () => {
  it('returns forward in LTR when sublist fits to the right', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 800,
    });

    expect(resolveSublistPlacement(rect(100, 280), 180, false)).toBe('forward');
  });

  it('returns backward in LTR when sublist would overflow right edge', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 400,
    });

    expect(resolveSublistPlacement(rect(300, 380), 180, false)).toBe('backward');
  });

  it('returns backward in RTL when sublist would overflow left edge', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 400,
    });

    expect(resolveSublistPlacement(rect(10, 100), 180, true)).toBe('backward');
  });
});

describe('resolvePanelPlacement', () => {
  it('aligns panel to end when it would overflow viewport in LTR', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 420,
    });

    expect(resolvePanelPlacement(rect(300, 400), 200, false)).toBe('backward');
  });

  it('aligns panel to end when it would overflow viewport in RTL', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 400,
    });

    expect(resolvePanelPlacement(rect(10, 180), 200, true)).toBe('backward');
  });
});
