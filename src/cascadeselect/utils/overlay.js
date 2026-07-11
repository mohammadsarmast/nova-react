const DEFAULT_MARGIN = 8;
const DEFAULT_SUBLIST_WIDTH = 180;

export function getViewportWidth() {
  if (typeof document === 'undefined') return 0;
  return document.documentElement.clientWidth;
}

function getPlacementSpaces(anchorRect, viewportWidth, rtl, variant) {
  const spaceBefore = anchorRect.left;
  const spaceAfter = viewportWidth - anchorRect.right;

  if (variant === 'panel') {
    return {
      forwardSpace: rtl ? anchorRect.right : viewportWidth - anchorRect.left,
      backwardSpace: rtl ? viewportWidth - anchorRect.left : anchorRect.right,
    };
  }

  return {
    forwardSpace: rtl ? spaceBefore : spaceAfter,
    backwardSpace: rtl ? spaceAfter : spaceBefore,
  };
}

export function resolveHorizontalPlacement({
  anchorRect,
  overlayWidth,
  viewportWidth,
  margin = DEFAULT_MARGIN,
  rtl = false,
  variant = 'sublist',
}) {
  const { forwardSpace, backwardSpace } = getPlacementSpaces(
    anchorRect,
    viewportWidth,
    rtl,
    variant
  );

  const fitsForward = overlayWidth + margin <= forwardSpace;
  const fitsBackward = overlayWidth + margin <= backwardSpace;

  if (!fitsForward && fitsBackward) return 'backward';
  if (fitsForward && !fitsBackward) return 'forward';
  if (!fitsForward && !fitsBackward) {
    return backwardSpace > forwardSpace ? 'backward' : 'forward';
  }
  return 'forward';
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
    rtl,
    variant: 'sublist',
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
    rtl,
    variant: 'panel',
  });
}
