const DEFAULT_MARGIN = 8;
const DEFAULT_SUBLIST_WIDTH = 180;

export function getViewportWidth() {
  if (typeof document === 'undefined') return 0;
  return document.documentElement.clientWidth;
}

export function resolveHorizontalPlacement({
  anchorRect,
  overlayWidth,
  viewportWidth,
  margin = DEFAULT_MARGIN,
  preferForward = true,
}) {
  const spaceAfter = viewportWidth - anchorRect.right;
  const spaceBefore = anchorRect.left;

  if (preferForward) {
    const fitsForward = overlayWidth + margin <= spaceAfter;
    const fitsBackward = overlayWidth + margin <= spaceBefore;

    if (!fitsForward && fitsBackward) return 'backward';
    if (!fitsForward && !fitsBackward) {
      return spaceBefore > spaceAfter ? 'backward' : 'forward';
    }
    return 'forward';
  }

  const fitsBackward = overlayWidth + margin <= spaceBefore;
  const fitsForward = overlayWidth + margin <= spaceAfter;

  if (!fitsBackward && fitsForward) return 'forward';
  if (!fitsBackward && !fitsForward) {
    return spaceAfter > spaceBefore ? 'forward' : 'backward';
  }
  return 'backward';
}

export function resolveSublistPlacement(
  anchorRect,
  overlayWidth = DEFAULT_SUBLIST_WIDTH,
  rtl = false,
  margin = DEFAULT_MARGIN
) {
  const viewportWidth = getViewportWidth();
  if (!anchorRect || viewportWidth <= 0) return 'forward';

  return resolveHorizontalPlacement({
    anchorRect,
    overlayWidth,
    viewportWidth,
    margin,
    preferForward: !rtl,
  });
}

export function resolvePanelPlacement(
  anchorRect,
  overlayWidth,
  rtl = false,
  margin = DEFAULT_MARGIN
) {
  const viewportWidth = getViewportWidth();
  if (!anchorRect || viewportWidth <= 0) return 'forward';

  return resolveHorizontalPlacement({
    anchorRect,
    overlayWidth,
    viewportWidth,
    margin,
    preferForward: !rtl,
  });
}
