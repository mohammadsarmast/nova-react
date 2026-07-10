export function rectsIntersect(a, b) {
  return (
    a.left < b.left + b.width
    && a.left + a.width > b.left
    && a.top < b.top + b.height
    && a.top + a.height > b.top
  );
}

export function normalizeRect(startX, startY, currentX, currentY) {
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  return { left, top, width, height };
}

export function getRelativeRect(element, container) {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    left: elementRect.left - containerRect.left,
    top: elementRect.top - containerRect.top,
    width: elementRect.width,
    height: elementRect.height,
  };
}

export function clampPosition(x, y, width, height, boundsWidth, boundsHeight) {
  const maxX = Math.max(0, boundsWidth - width);
  const maxY = Math.max(0, boundsHeight - height);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}
