import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useWorkspaceContext } from './WorkspaceContext.jsx';
import { cn } from './utils/cn.js';

function resolveLayout(layout, x, y) {
  if (layout) return layout;
  return x != null || y != null ? 'free' : 'flow';
}

export function WorkspaceItem({
  id,
  layout,
  x,
  y,
  width,
  height,
  data,
  className,
  style,
  disabled = false,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const {
    selectedSet,
    positions,
    registerItem,
    unregisterItem,
    handleItemPointerDown,
    disabled: workspaceDisabled,
    rtl,
    layoutLocked,
  } = useWorkspaceContext();

  const resolvedLayout = resolveLayout(layout, x, y);
  const isFree = resolvedLayout === 'free';
  const resolvedPosition = isFree
    ? positions[id] ?? { x: x ?? 0, y: y ?? 0 }
    : null;
  const selected = selectedSet.has(id);
  const isDisabled = disabled || workspaceDisabled;

  useLayoutEffect(() => {
    registerItem({
      id,
      layout: resolvedLayout,
      x: isFree ? resolvedPosition.x : undefined,
      y: isFree ? resolvedPosition.y : undefined,
      width: isFree ? width : undefined,
      height: isFree ? height : undefined,
      data,
      element: ref.current,
    });
  }, [
    id,
    registerItem,
    resolvedLayout,
    isFree,
    resolvedPosition?.x,
    resolvedPosition?.y,
    width,
    height,
    data,
  ]);

  useEffect(() => () => unregisterItem(id), [id, unregisterItem]);

  return (
    <div
      ref={ref}
      data-workspace-item
      data-item-id={id}
      data-layout={resolvedLayout}
      className={cn(
        'nr-workspace__item',
        isFree ? 'nr-workspace__item--free' : 'nr-workspace__item--flow',
        selected && 'nr-workspace__item--selected',
        isDisabled && 'nr-workspace__item--disabled',
        isFree && !layoutLocked && 'nr-workspace__item--movable',
        className
      )}
      style={{
        ...style,
        ...(isFree ? {
          width: width ?? 108,
          height: height ?? 88,
          transform: `translate(${resolvedPosition.x}px, ${resolvedPosition.y}px)`,
        } : {}),
      }}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-pressed={selected || undefined}
      aria-disabled={isDisabled || undefined}
      onPointerDown={(event) => {
        if (isDisabled) return;
        handleItemPointerDown(event, id);
      }}
      {...rest}
    >
      <div className="nr-workspace__item-content" dir={rtl ? 'rtl' : undefined}>
        {children}
      </div>
    </div>
  );
}
