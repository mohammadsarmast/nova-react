import { useEffect, useState } from 'react';

function normalizeBreakpoint(breakpoint) {
  if (breakpoint == null || breakpoint === false) return null;
  if (typeof breakpoint === 'number') return `${breakpoint}px`;
  return String(breakpoint);
}

export function useBreakpoint(breakpoint) {
  const query = normalizeBreakpoint(breakpoint);

  const [matches, setMatches] = useState(() => {
    if (!query || typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${query})`).matches;
  });

  useEffect(() => {
    if (!query || typeof window === 'undefined') return undefined;

    const mq = window.matchMedia(`(max-width: ${query})`);
    const handler = (event) => setMatches(event.matches);

    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
