export function resolveChartFontFamily(container, explicitFont) {
  if (explicitFont) return explicitFont;

  if (typeof window !== 'undefined' && container) {
    const computed = window.getComputedStyle(container).fontFamily;
    if (computed && computed !== 'inherit') {
      return computed;
    }
  }

  return 'sans-serif';
}
