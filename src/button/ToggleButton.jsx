import React, { useState } from 'react';
import { Button } from './Button.jsx';

export const ToggleButton = React.forwardRef(function ToggleButton({
  pressed,
  defaultPressed = false,
  onChange,
  onClick,
  ...buttonProps
}, ref) {
  const isControlled = pressed !== undefined;
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isPressed = isControlled ? pressed : internalPressed;

  const handleClick = (event) => {
    const next = !isPressed;
    if (!isControlled) setInternalPressed(next);
    onChange?.({ pressed: next, originalEvent: event });
    onClick?.(event);
  };

  return (
    <Button
      {...buttonProps}
      ref={ref}
      active={isPressed}
      aria-pressed={isPressed}
      onClick={handleClick}
    />
  );
});

export default ToggleButton;
