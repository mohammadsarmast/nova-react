import React, { Children, cloneElement, useId, useState } from 'react';
import { cn } from './utils/cn.js';

function mergeHandler(existing, next) {
  return (event) => {
    existing?.(event);
    next(event);
  };
}

export function Tooltip({
  children,
  content,
  position = 'top',
  rtl = false,
  className,
  id: idProp,
}) {
  const generatedId = useId();
  const tooltipId = idProp ?? generatedId;
  const [visible, setVisible] = useState(false);

  if (!content) return children;

  const child = Children.only(children);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const enhancedChild = cloneElement(child, {
    'aria-describedby': cn(child.props['aria-describedby'], tooltipId) || undefined,
    onFocus: mergeHandler(child.props.onFocus, show),
    onBlur: mergeHandler(child.props.onBlur, hide),
    onMouseEnter: mergeHandler(child.props.onMouseEnter, show),
    onMouseLeave: mergeHandler(child.props.onMouseLeave, hide),
    onTouchStart: mergeHandler(child.props.onTouchStart, show),
    onTouchEnd: mergeHandler(child.props.onTouchEnd, hide),
    onKeyDown: mergeHandler(child.props.onKeyDown, (event) => {
      if (event.key === 'Escape') hide();
    }),
  });

  return (
    <span
      className={cn('nr-btn-tooltip-wrap', rtl && 'nr-btn-tooltip-wrap--rtl', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={show}
      onTouchEnd={hide}
    >
      {enhancedChild}
      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          'nr-btn-tooltip',
          `nr-btn-tooltip--${position}`,
          visible && 'nr-btn-tooltip--visible'
        )}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
