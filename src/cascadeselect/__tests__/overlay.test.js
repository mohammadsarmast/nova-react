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
  it('prefers forward when space is available', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(100, 200),
        overlayWidth: 150,
        viewportWidth: 400,
        preferForward: true,
      })
    ).toBe('forward');
  });

  it('flips backward when forward does not fit but backward does', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(300, 380),
        overlayWidth: 180,
        viewportWidth: 400,
        preferForward: true,
      })
    ).toBe('backward');
  });

  it('picks side with more space when neither fits', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(250, 320),
        overlayWidth: 300,
        viewportWidth: 400,
        preferForward: true,
      })
    ).toBe('backward');
  });

  it('prefers backward in RTL mode when space allows', () => {
    expect(
      resolveHorizontalPlacement({
        anchorRect: rect(220, 280),
        overlayWidth: 150,
        viewportWidth: 400,
        preferForward: false,
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
});

describe('resolvePanelPlacement', () => {
  it('aligns panel to end when it would overflow viewport in LTR', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 420,
    });

    expect(resolvePanelPlacement(rect(300, 400), 200, false)).toBe('backward');
  });
});
