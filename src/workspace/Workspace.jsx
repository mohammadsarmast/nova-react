import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WorkspaceContext } from './WorkspaceContext.jsx';
import { cn } from './utils/cn.js';
import {
  applyItemSelection,
  applyMarqueeSelection,
  getMarqueeHitIds,
  normalizeSelection,
} from './utils/selection.js';
import { clampPosition, normalizeRect } from './utils/geometry.js';
import { getItemsForMarquee, resolveWorkspaceItems } from './utils/items.js';
import './styles/workspace.css';

const DRAG_THRESHOLD = 4;

export function Workspace({
  children,
  selection: selectionProp,
  defaultSelection = [],
  onSelectionChange,
  selectionMode = 'multiple',
  className,
  style,
  disabled = false,
  defaultLayoutLocked = true,
  layoutLocked: layoutLockedProp,
  onLayoutLockedChange,
  showLayoutLockButton = false,
  layoutLockButtonLabel,
  onItemPositionChange,
  onMarqueeSelect,
  onItemClick,
  height = 420,
  rtl = false,
  ariaLabel = 'Workspace selection surface',
}) {
  const containerRef = useRef(null);
  const itemsRef = useRef(new Map());
  const [selectionState, setSelectionState] = useState(defaultSelection);
  const [layoutLockedState, setLayoutLockedState] = useState(defaultLayoutLocked);
  const [marquee, setMarquee] = useState(null);
  const [dragSession, setDragSession] = useState(null);
  const [positions, setPositions] = useState({});

  const selection = selectionProp ?? selectionState;
  const selectedSet = useMemo(() => new Set(normalizeSelection(selection)), [selection]);
  const layoutLocked = layoutLockedProp ?? layoutLockedState;

  const emitSelection = useCallback((next) => {
    if (selectionProp == null) setSelectionState(next);
    const selectedItems = resolveWorkspaceItems(next, itemsRef.current, positions, containerRef.current);
    onSelectionChange?.({
      value: next,
      selection: next,
      selectedItems,
      items: selectedItems,
    });
  }, [selectionProp, onSelectionChange, positions]);

  const emitLayoutLocked = useCallback((next) => {
    if (layoutLockedProp == null) setLayoutLockedState(next);
    onLayoutLockedChange?.({ value: next, layoutLocked: next });
  }, [layoutLockedProp, onLayoutLockedChange]);

  const toggleLayoutLocked = useCallback(() => {
    emitLayoutLocked(!layoutLocked);
  }, [emitLayoutLocked, layoutLocked]);

  const registerItem = useCallback((item) => {
    itemsRef.current.set(item.id, item);
  }, []);

  const unregisterItem = useCallback((id) => {
    itemsRef.current.delete(id);
  }, []);

  const getContainerPoint = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const endInteractions = useCallback(() => {
    setMarquee(null);
    setDragSession(null);
    document.body.classList.remove('nr-workspace--dragging');
    document.body.classList.remove('nr-workspace--marquee');
  }, []);

  const handleCanvasPointerDown = useCallback((event) => {
    if (disabled || event.button !== 0) return;
    if (event.target.closest('[data-workspace-item]')) return;

    const point = getContainerPoint(event.clientX, event.clientY);
    setMarquee({
      startX: point.x,
      startY: point.y,
      currentX: point.x,
      currentY: point.y,
      modifiers: {
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      },
    });
    document.body.classList.add('nr-workspace--marquee');

    const handleMove = (moveEvent) => {
      const nextPoint = getContainerPoint(moveEvent.clientX, moveEvent.clientY);
      setMarquee((current) => current && {
        ...current,
        currentX: nextPoint.x,
        currentY: nextPoint.y,
      });
    };

    const handleUp = (upEvent) => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);

      const endPoint = getContainerPoint(upEvent.clientX, upEvent.clientY);
      const rect = normalizeRect(point.x, point.y, endPoint.x, endPoint.y);
      const items = getItemsForMarquee(itemsRef.current, containerRef.current, positions);
      const hitIds = getMarqueeHitIds(items, rect);
      const next = applyMarqueeSelection(selection, hitIds, {
        ctrlKey: upEvent.ctrlKey,
        metaKey: upEvent.metaKey,
      }, { selectionMode });

      emitSelection(next);
      const selectedItems = resolveWorkspaceItems(next, itemsRef.current, positions, containerRef.current);
      onMarqueeSelect?.({
        value: next,
        hitIds,
        rect,
        selectedItems,
        items: selectedItems,
      });
      endInteractions();
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  }, [disabled, emitSelection, endInteractions, getContainerPoint, onMarqueeSelect, positions, selection, selectionMode]);

  const handleItemPointerDown = useCallback((event, itemId) => {
    if (disabled || event.button !== 0) return;
    event.stopPropagation();

    const item = itemsRef.current.get(itemId);
    if (!item) return;

    const startPoint = getContainerPoint(event.clientX, event.clientY);
    const currentSelection = normalizeSelection(selection);
    const isItemSelected = selectedSet.has(itemId);
    let moved = false;

    const dragIds = isItemSelected && selectionMode === 'multiple'
      ? currentSelection
      : [itemId];

    const startPositions = Object.fromEntries(
      dragIds.map((id) => {
        const meta = itemsRef.current.get(id);
        return [id, {
          x: positions[id]?.x ?? meta?.x ?? 0,
          y: positions[id]?.y ?? meta?.y ?? 0,
        }];
      })
    );

    const handleMove = (moveEvent) => {
      if (layoutLocked || item.layout !== 'free') return;

      const point = getContainerPoint(moveEvent.clientX, moveEvent.clientY);
      const deltaX = point.x - startPoint.x;
      const deltaY = point.y - startPoint.y;

      if (!moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return;
      moved = true;
      setDragSession({ ids: dragIds });

      const bounds = containerRef.current?.getBoundingClientRect();
      const nextPositions = { ...positions };

      dragIds.forEach((id) => {
        const meta = itemsRef.current.get(id);
        if (!meta || !bounds) return;
        const width = meta.width ?? 100;
        const height = meta.height ?? 80;
        const start = startPositions[id];
        const clamped = clampPosition(
          start.x + deltaX,
          start.y + deltaY,
          width,
          height,
          bounds.width,
          bounds.height
        );
        nextPositions[id] = clamped;
        onItemPositionChange?.(id, clamped);
      });

      setPositions((current) => ({ ...current, ...nextPositions }));
      document.body.classList.add('nr-workspace--dragging');
    };

    const handleUp = (upEvent) => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);

      if (!moved) {
        const next = applyItemSelection(selection, itemId, {
          shiftKey: upEvent.shiftKey,
          altKey: upEvent.altKey,
          ctrlKey: upEvent.ctrlKey,
          metaKey: upEvent.metaKey,
        }, { selectionMode });
        emitSelection(next);
        const selectedItems = resolveWorkspaceItems(next, itemsRef.current, positions, containerRef.current);
        const itemDetails = resolveWorkspaceItems([itemId], itemsRef.current, positions, containerRef.current)[0];
        onItemClick?.({
          id: itemId,
          item: itemDetails,
          selected: next.includes(itemId),
          selection: next,
          selectedItems,
          items: selectedItems,
          originalEvent: upEvent,
        });
      }

      endInteractions();
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  }, [
    disabled,
    emitSelection,
    endInteractions,
    getContainerPoint,
    onItemClick,
    onItemPositionChange,
    positions,
    selectedSet,
    selection,
    selectionMode,
    layoutLocked,
  ]);

  const marqueeStyle = marquee ? (() => {
    const rect = normalizeRect(marquee.startX, marquee.startY, marquee.currentX, marquee.currentY);
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  })() : null;

  const contextValue = useMemo(() => ({
    selection,
    selectedSet,
    positions,
    registerItem,
    unregisterItem,
    handleItemPointerDown,
    disabled,
    rtl,
    layoutLocked,
  }), [
    selection,
    selectedSet,
    positions,
    registerItem,
    unregisterItem,
    handleItemPointerDown,
    disabled,
    rtl,
    layoutLocked,
  ]);

  const lockButtonText = layoutLockButtonLabel ?? (layoutLocked ? 'Unlock layout' : 'Lock layout');

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          'nr-workspace',
          rtl && 'nr-workspace--rtl',
          disabled && 'nr-workspace--disabled',
          layoutLocked && 'nr-workspace--layout-locked',
          showLayoutLockButton && 'nr-workspace--with-toolbar',
          className
        )}
        style={{ ...style, height }}
        role="application"
        aria-label={ariaLabel}
        onPointerDown={handleCanvasPointerDown}
      >
        {showLayoutLockButton ? (
          <div className="nr-workspace__toolbar">
            <button
              type="button"
              className={cn(
                'nr-workspace__lock-button',
                layoutLocked && 'nr-workspace__lock-button--locked'
              )}
              onClick={toggleLayoutLocked}
              onPointerDown={(event) => event.stopPropagation()}
              aria-pressed={!layoutLocked}
              aria-label={lockButtonText}
            >
              <span className="nr-workspace__lock-button-icon" aria-hidden="true">
                {layoutLocked ? '🔒' : '🔓'}
              </span>
              <span>{lockButtonText}</span>
            </button>
          </div>
        ) : null}
        <div className="nr-workspace__canvas">
          {children}
        </div>
        {marqueeStyle ? (
          <div className="nr-workspace__marquee" style={marqueeStyle} aria-hidden="true" />
        ) : null}
        {dragSession ? <div className="nr-workspace__drag-overlay" aria-hidden="true" /> : null}
      </div>
    </WorkspaceContext.Provider>
  );
}

export default Workspace;
