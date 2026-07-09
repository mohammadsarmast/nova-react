import React, { Children, cloneElement } from 'react';
import { cn } from './utils/cn.js';

export function ButtonGroup({
  children,
  attached = true,
  vertical = false,
  fullWidth = false,
  rtl = false,
  className,
  ...rest
}) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <div
      className={cn(
        'nr-btn-group',
        attached && 'nr-btn-group--attached',
        vertical && 'nr-btn-group--vertical',
        fullWidth && 'nr-btn-group--full',
        rtl && 'nr-btn-group--rtl',
        className
      )}
      role="group"
      {...rest}
    >
      {items.map((child, index) => {
        if (!child.props) return child;
        return cloneElement(child, {
          key: child.key ?? index,
          rtl: child.props.rtl ?? rtl,
          className: cn(child.props.className, 'nr-btn-group__item'),
        });
      })}
    </div>
  );
}

export default ButtonGroup;
