import { rectsIntersect } from './geometry.js';

export function isSelected(selection, id) {
  if (Array.isArray(selection)) return selection.includes(id);
  return selection === id;
}

export function normalizeSelection(selection) {
  if (selection == null) return [];
  return Array.isArray(selection) ? selection : [selection];
}

export function applyItemSelection(selection, itemId, modifiers = {}, options = {}) {
  const current = normalizeSelection(selection);
  const selected = current.includes(itemId);
  const { shiftKey, altKey, ctrlKey, metaKey } = modifiers;
  const allowMulti = options.selectionMode !== 'single';

  if (altKey && selected) {
    return current.filter((id) => id !== itemId);
  }

  if (shiftKey && !selected && allowMulti) {
    return [...current, itemId];
  }

  if ((ctrlKey || metaKey) && allowMulti) {
    return selected
      ? current.filter((id) => id !== itemId)
      : [...current, itemId];
  }

  return [itemId];
}

export function applyMarqueeSelection(selection, hitIds, modifiers = {}, options = {}) {
  const current = normalizeSelection(selection);
  const { ctrlKey, metaKey } = modifiers;
  const allowMulti = options.selectionMode !== 'single';

  if (!hitIds.length) {
    return ctrlKey || metaKey ? current : [];
  }

  if ((ctrlKey || metaKey) && allowMulti) {
    return [...new Set([...current, ...hitIds])];
  }

  return hitIds;
}

export function getMarqueeHitIds(items, marqueeRect) {
  return items
    .filter((item) => {
      const rect = {
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
      };
      return rectsIntersect(rect, marqueeRect);
    })
    .map((item) => item.id);
}
