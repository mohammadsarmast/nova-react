import React, { forwardRef, useCallback, useRef } from 'react';
import { Tooltip } from './Tooltip.jsx';
import { cn } from './utils/cn.js';
import { getCustomColorVars } from './utils/color.js';
import './styles/button.css';

function Spinner({ className }) {
  return (
    <span className={cn('nr-btn-spinner', className)} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function formatBadgeValue(value) {
  const num = Number(value);
  if (!Number.isNaN(num) && num > 99) return '99+';
  return String(value);
}

function Badge({ value, severity, className }) {
  if (value == null || value === '' || value === false) return null;
  const text = formatBadgeValue(value);
  return (
    <span
      className={cn('nr-btn-badge', severity && `nr-btn-badge--${severity}`, className)}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

function buildAriaLabel({ ariaLabel, label, content, iconOnly, showBadge, badge }) {
  if (ariaLabel) return ariaLabel;

  const textLabel = label || (typeof content === 'string' ? content : undefined);
  if (!textLabel) return undefined;

  if (showBadge) {
    const badgeText = formatBadgeValue(badge);
    return `${textLabel}, ${badgeText}`;
  }

  if (iconOnly) return textLabel;

  return undefined;
}

export const Button = forwardRef(function Button(props, ref) {
  const {
    label,
    children,
    type = 'button',
    variant = 'solid',
    severity = 'primary',
    size = 'md',
    icon,
    iconRight,
    iconPos,
    iconOnly = false,
    loading = false,
    loadingText,
    disabled = false,
    raised = false,
    rounded = false,
    fullWidth = false,
    active = false,
    badge,
    badgeSeverity,
    badgeClassName,
    href,
    target,
    rel,
    ripple = true,
    color,
    theme = 'light',
    rtl = false,
    tooltip,
    tooltipPosition = 'top',
    className,
    style,
    contentClassName,
    onClick,
    tabIndex,
    'aria-label': ariaLabel,
    ...rest
  } = props;

  const innerRef = useRef(null);
  const setRef = useCallback(
    (node) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const isDisabled = disabled || loading;
  const isLinkVariant = variant === 'link';
  const leftIcon = iconPos === 'right' ? iconRight : icon;
  const rightIcon = iconPos === 'right' ? icon : iconRight;
  const content = children ?? label;
  const showBadge = badge != null && badge !== '' && badge !== false;
  const customColorVars = getCustomColorVars(color);
  const mergedStyle = { ...customColorVars, ...style };

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    if (ripple && innerRef.current) {
      const rect = innerRef.current.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      const isKeyboard = e.clientX === 0 && e.clientY === 0;
      const x = isKeyboard ? rect.width / 2 : e.clientX - rect.left;
      const y = isKeyboard ? rect.height / 2 : e.clientY - rect.top;
      const rippleEl = document.createElement('span');
      rippleEl.className = 'nr-btn-ripple';
      rippleEl.style.width = `${rippleSize}px`;
      rippleEl.style.height = `${rippleSize}px`;
      rippleEl.style.left = `${x - rippleSize / 2}px`;
      rippleEl.style.top = `${y - rippleSize / 2}px`;
      innerRef.current.appendChild(rippleEl);
      const removeRipple = () => rippleEl.remove();
      rippleEl.addEventListener('animationend', removeRipple);
      window.setTimeout(removeRipple, 600);
    }

    onClick?.(e);
  };

  const classes = cn(
    'nr-btn',
    `nr-btn--${variant}`,
    `nr-btn--${severity}`,
    `nr-btn--${size}`,
    raised && 'nr-btn--raised',
    rounded && 'nr-btn--rounded',
    fullWidth && 'nr-btn--full',
    iconOnly && 'nr-btn--icon-only',
    loading && 'nr-btn--loading',
    active && 'nr-btn--active',
    isLinkVariant && 'nr-btn--link-mode',
    href && 'nr-btn--href',
    showBadge && 'nr-btn--has-badge',
    color && 'nr-btn--custom-color',
    theme === 'dark' && 'nr-btn--dark',
    rtl && 'nr-btn--rtl',
    className
  );

  const inner = (
    <>
      <span className="nr-btn-body">
        {loading && <Spinner />}
        {!loading && leftIcon && (
          <span className={cn('nr-btn-icon', 'nr-btn-icon--left')}>{leftIcon}</span>
        )}
        {!iconOnly && content && (
          <span className={cn('nr-btn-label', contentClassName)}>
            {loading && loadingText ? loadingText : content}
          </span>
        )}
        {!loading && rightIcon && (
          <span className={cn('nr-btn-icon', 'nr-btn-icon--right')}>{rightIcon}</span>
        )}
      </span>
      {showBadge && <Badge value={badge} severity={badgeSeverity} className={badgeClassName} />}
    </>
  );

  const resolvedAriaLabel = buildAriaLabel({
    ariaLabel,
    label,
    content,
    iconOnly,
    showBadge,
    badge,
  });

  const commonProps = {
    ref: setRef,
    className: classes,
    style: mergedStyle,
    onClick: handleClick,
    'aria-busy': loading || undefined,
    'aria-disabled': isDisabled || undefined,
    'aria-label': resolvedAriaLabel,
    ...rest,
  };

  let element;

  if (href) {
    element = (
      <a
        {...commonProps}
        href={href}
        target={!isDisabled ? target : undefined}
        rel={!isDisabled && target === '_blank' ? rel ?? 'noopener noreferrer' : rel}
        tabIndex={isDisabled ? -1 : tabIndex}
      >
        {inner}
      </a>
    );
  } else {
    element = (
      <button {...commonProps} type={type} disabled={isDisabled} tabIndex={tabIndex}>
        {inner}
      </button>
    );
  }

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition} rtl={rtl}>
        {element}
      </Tooltip>
    );
  }

  return element;
});

export default Button;
