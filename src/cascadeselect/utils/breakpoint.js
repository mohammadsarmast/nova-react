export function normalizeBreakpoint(breakpoint) {
  if (breakpoint == null || breakpoint === false) return null;
  if (typeof breakpoint === 'number') return `${breakpoint}px`;
  return String(breakpoint);
}
