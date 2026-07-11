import { useLayoutEffect, useState } from 'react';
import { resolvePanelPlacement, resolveSublistPlacement } from '../utils/overlay.js';

export function useSublistPlacement(isOpen, anchorRef, sublistRef, rtl, deps = []) {
  const [placement, setPlacement] = useState('forward');

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) {
      setPlacement('forward');
      return undefined;
    }

    const update = () => {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const overlayWidth = sublistRef?.current?.offsetWidth || 180;
      setPlacement(resolveSublistPlacement(anchorRect, overlayWidth, rtl));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isOpen, rtl, anchorRef, sublistRef, ...deps]);

  return placement;
}

export function usePanelPlacement(isOpen, panelRef, triggerRef, rtl) {
  const [placement, setPlacement] = useState('forward');

  useLayoutEffect(() => {
    if (!isOpen || !panelRef?.current || !triggerRef?.current) {
      setPlacement('forward');
      return undefined;
    }

    const update = () => {
      const anchorRect = triggerRef.current.getBoundingClientRect();
      const overlayWidth = panelRef.current.offsetWidth;
      setPlacement(resolvePanelPlacement(anchorRect, overlayWidth, rtl));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isOpen, panelRef, triggerRef, rtl]);

  return placement;
}
