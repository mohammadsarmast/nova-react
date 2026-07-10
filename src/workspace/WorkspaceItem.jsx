import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useWorkspaceContext } from './WorkspaceContext.jsx';
import { cn } from './utils/cn.js';

export function WorkspaceItem({
  id,
  x = 0,
  y = 0,
  width = 108,
  height = 88,
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

  const resolvedPosition = positions[id] ?? { x, y };
  const selected = selectedSet.has(id);
  const isDisabled = disabled || workspaceDisabled;

  useLayoutEffect(() => {
    registerItem({ id, x: resolvedPosition.x, y: resolvedPosition.y, width, height });
  }, [id, registerItem, resolvedPosition.x, resolvedPosition.y, width, height]);

  useEffect(() => () => unregisterItem(id), [id, unregisterItem]);

  return (
    <div
      ref={ref}
      data-workspace-item
      data-item-id={id}
      className={cn(
        'nr-workspace__item',
        selected && 'nr-workspace__item--selected',
        isDisabled && 'nr-workspace__item--disabled',
        !layoutLocked && 'nr-workspace__item--movable',
        className
      )}
      style={{
        ...style,
        width,
        height,
        transform: `translate(${resolvedPosition.x}px, ${resolvedPosition.y}px)`,
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
