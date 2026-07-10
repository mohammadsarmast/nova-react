import { normalizeSelection } from './selection.js';

export function resolveWorkspaceItems(selection, itemsMap, positions = {}) {
  return normalizeSelection(selection).map((id) => {
    const item = itemsMap?.get?.(id) ?? itemsMap?.[id];
    const position = positions[id];

    if (!item) {
      return {
        id,
        x: position?.x ?? 0,
        y: position?.y ?? 0,
      };
    }

    return {
      id,
      x: position?.x ?? item.x ?? 0,
      y: position?.y ?? item.y ?? 0,
      width: item.width,
      height: item.height,
      data: item.data,
    };
  });
}
