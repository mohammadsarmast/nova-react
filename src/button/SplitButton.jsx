import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from './Button.jsx';
import { ButtonGroup } from './ButtonGroup.jsx';
import { useClickOutside } from './hooks/useClickOutside.js';
import { cn } from './utils/cn.js';

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

export function SplitButton({
  label,
  icon,
  model = [],
  onClick,
  onItemClick,
  menuIcon,
  severity = 'primary',
  size = 'md',
  disabled = false,
  rtl = false,
  className,
  menuButtonAriaLabel = 'Show menu',
  ...buttonProps
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuId = useId();
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    toggleRef.current?.focus();
  }, []);

  const selectableItems = useMemo(
    () =>
      model
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.separator && !item.disabled),
    [model]
  );

  useClickOutside([rootRef], close, open);

  useEffect(() => {
    if (open && selectableItems.length > 0) {
      setActiveIndex(0);
    }
  }, [open, selectableItems.length]);

  const handleItemClick = (item, index, event) => {
    if (item.disabled) return;
    item.command?.({ item, index, originalEvent: event });
    onItemClick?.({ item, index, originalEvent: event });
    close();
  };

  const activeDescendantId =
    open && activeIndex >= 0 && selectableItems[activeIndex]
      ? `${menuId}-item-${selectableItems[activeIndex].index}`
      : undefined;

  const handleKeyDown = (event) => {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) =>
          selectableItems.length ? (prev + 1) % selectableItems.length : -1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) =>
          selectableItems.length
            ? (prev - 1 + selectableItems.length) % selectableItems.length
            : -1
        );
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(selectableItems.length ? 0 : -1);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(selectableItems.length ? selectableItems.length - 1 : -1);
        break;
      case 'Enter':
      case ' ':
        if (activeIndex >= 0 && selectableItems[activeIndex]) {
          event.preventDefault();
          const { item, index } = selectableItems[activeIndex];
          handleItemClick(item, index, event);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('nr-split-btn', rtl && 'nr-split-btn--rtl', className)}
      onKeyDown={handleKeyDown}
    >
      <ButtonGroup attached rtl={rtl}>
        <Button
          {...buttonProps}
          label={label}
          icon={icon}
          severity={severity}
          size={size}
          disabled={disabled}
          rtl={rtl}
          className="nr-split-btn__main"
          onClick={(event) => {
            onClick?.(event);
            close();
          }}
        />
        <Button
          ref={toggleRef}
          severity={severity}
          size={size}
          disabled={disabled}
          rtl={rtl}
          icon={menuIcon ?? <ChevronDownIcon />}
          iconOnly
          className="nr-split-btn__toggle"
          aria-label={menuButtonAriaLabel}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-activedescendant={activeDescendantId}
          onClick={() => setOpen((prev) => !prev)}
        />
      </ButtonGroup>

      {open && (
        <ul id={menuId} className="nr-split-btn__menu" role="menu">
          {model.map((item, index) => {
            if (item.separator) {
              return <li key={`sep-${index}`} className="nr-split-btn__separator" role="separator" />;
            }

            const selectableIndex = selectableItems.findIndex((entry) => entry.index === index);
            const isHighlighted = selectableIndex === activeIndex;
            const itemId = `${menuId}-item-${index}`;

            return (
              <li key={`${item.label}-${index}`} role="none">
                <button
                  id={itemId}
                  type="button"
                  role="menuitem"
                  className={cn(
                    'nr-split-btn__menu-item',
                    item.severity && `nr-split-btn__menu-item--${item.severity}`,
                    item.disabled && 'nr-split-btn__menu-item--disabled',
                    isHighlighted && 'nr-split-btn__menu-item--highlighted'
                  )}
                  disabled={item.disabled}
                  onClick={(event) => handleItemClick(item, index, event)}
                  onMouseEnter={() => !item.disabled && setActiveIndex(selectableIndex)}
                >
                  {item.icon && <span className="nr-split-btn__menu-icon">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SplitButton;
