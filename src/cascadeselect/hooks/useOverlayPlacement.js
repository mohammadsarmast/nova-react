import { useLayoutEffect, useState } from 'react';
import { resolvePanelPlacement, resolveSublistPlacement } from '../utils/overlay.js';

function bindOverlayListeners(update) {
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, true);
  return () => {
    window.removeEventListener('resize', update);
    window.removeEventListener('scroll', update, true);
  };
}

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
    const raf = requestAnimationFrame(update);
    const removeListeners = bindOverlayListeners(update);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && sublistRef?.current) {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(sublistRef.current);
    }

    return () => {
      cancelAnimationFrame(raf);
      removeListeners();
      resizeObserver?.disconnect();
    };
  }, [isOpen, rtl, anchorRef, sublistRef, ...deps]);

  return placement;
}

export function usePanelPlacement(isOpen, panelRef, anchorRef, rtl) {
  const [placement, setPlacement] = useState('forward');

  useLayoutEffect(() => {
    if (!isOpen || !panelRef?.current || !anchorRef?.current) {
      setPlacement('forward');
      return undefined;
    }

    const update = () => {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const overlayWidth = panelRef.current.offsetWidth;
      setPlacement(resolvePanelPlacement(anchorRect, overlayWidth, rtl));
    };

    update();
    const raf = requestAnimationFrame(update);
    const removeListeners = bindOverlayListeners(update);

    return () => {
      cancelAnimationFrame(raf);
      removeListeners();
    };
  }, [isOpen, panelRef, anchorRef, rtl]);

  return placement;
}
