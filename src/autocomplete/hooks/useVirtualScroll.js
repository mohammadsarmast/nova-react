import { useCallback, useMemo, useState } from 'react';

export function useVirtualScroll(itemCount, itemSize, containerHeight) {
  const [scrollTop, setScrollTop] = useState(0);

  const state = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemSize) + 2;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - 1);
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount);
    const offsetY = startIndex * itemSize;
    const totalHeight = itemCount * itemSize;

    return { startIndex, endIndex, offsetY, totalHeight, visibleCount };
  }, [itemCount, itemSize, containerHeight, scrollTop]);

  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index) => {
    setScrollTop((prev) => {
      const itemTop = index * itemSize;
      const itemBottom = itemTop + itemSize;
      if (itemTop < prev) return itemTop;
      if (itemBottom > prev + containerHeight) return itemBottom - containerHeight;
      return prev;
    });
  }, [itemSize, containerHeight]);

  const reset = useCallback(() => setScrollTop(0), []);

  return { state, onScroll, reset, scrollTop, setScrollTop, scrollToIndex };
}
