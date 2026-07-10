import { getRelativeRect } from './geometry.js';
import { normalizeSelection } from './selection.js';

export function getItemBounds(item, container, positions = {}) {
  if (!item) {
    return { x: 0, y: 0 };
  }

  if (item.layout === 'free') {
    return {
      x: positions[item.id]?.x ?? item.x ?? 0,
      y: positions[item.id]?.y ?? item.y ?? 0,
      width: item.width,
      height: item.height,
    };
  }

  if (item.element && container) {
    const rect = getRelativeRect(item.element, container);
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  return { x: 0, y: 0 };
}

export function getItemsForMarquee(itemsMap, container, positions = {}) {
  return [...itemsMap.values()].map((item) => ({
    id: item.id,
    ...getItemBounds(item, container, positions),
  }));
}

export function resolveWorkspaceItems(selection, itemsMap, positions = {}, container = null) {
  return normalizeSelection(selection).map((id) => {
    const item = itemsMap?.get?.(id) ?? itemsMap?.[id];
    const bounds = getItemBounds(item, container, positions);

    return {
      id,
      layout: item?.layout ?? 'flow',
      ...bounds,
      data: item?.data,
    };
  });
}
