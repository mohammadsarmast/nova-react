import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useClickOutside } from './hooks/useClickOutside.js';
import { useBreakpoint } from './hooks/useBreakpoint.js';
import { cn } from './utils/cn.js';
import {
  findSelectedLabel,
  getChildOptions,
  getOptionLabelValue,
  getOptionValue,
  isGroupOption,
  isOptionDisabled,
  normalizeGroupChildren,
} from './utils/options.js';
import {
  cascadeSelectColorsToCssVars,
  resolveCascadeSelectThemeColors,
} from './utils/themeColors.js';
import {
  getCascadeSelectLocaleConfig,
  isCascadeSelectRtlLocale,
  resolveCascadeSelectLocale,
} from './utils/locale.js';
import './styles/cascadeselect.css';

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CascadeSublist({
  options,
  level,
  config,
  openPath,
  onOpen,
  onBack,
  onSelect,
  onClose,
  focusReq,
  setFocusReq,
}) {
  const { optionLabel, optionGroupLabel, optionGroupChildren, optionValue, itemTemplate, rtl, isMobile } = config;
  const itemRefs = useRef([]);
  const forwardKey = rtl ? 'ArrowLeft' : 'ArrowRight';
  const backKey = rtl ? 'ArrowRight' : 'ArrowLeft';

  useEffect(() => {
    if (!focusReq || focusReq.level !== level) return;
    const idx = options.indexOf(focusReq.option);
    const el = itemRefs.current[idx >= 0 ? idx : 0];
    el?.focus();
  }, [focusReq, level, options]);

  const moveFocus = (nextIndex) => {
    const len = options.length;
    const wrapped = ((nextIndex % len) + len) % len;
    setFocusReq({ level, option: options[wrapped] });
  };

  const openGroup = (option) => {
    onOpen(level, option);
    const firstChild = getChildOptions(option, level, optionGroupChildren)[0];
    setFocusReq({ level: level + 1, option: firstChild });
  };

  const handleKeyDown = (event, index, option, group) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(index - 1);
        break;
      case forwardKey:
        event.preventDefault();
        if (group && !isOptionDisabled(option)) openGroup(option);
        break;
      case backKey:
        event.preventDefault();
        if (level > 0) onBack(level);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOptionDisabled(option)) break;
        if (group) openGroup(option);
        else onSelect(option);
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <ul className="nr-cs__list" role="menu">
      {options.map((option, index) => {
        const group = isGroupOption(option, level, optionGroupChildren);
        const disabled = isOptionDisabled(option);
        const label = getOptionLabelValue(option, group, optionLabel, optionGroupLabel);
        const isOpen = group && openPath[level] === option;

        return (
          <li key={index} className="nr-cs__item" role="none">
            <button
              type="button"
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="menuitem"
              aria-haspopup={group || undefined}
              aria-expanded={group ? isOpen : undefined}
              disabled={disabled}
              tabIndex={-1}
              className={cn(
                'nr-cs__option',
                group && 'nr-cs__option--group',
                isOpen && 'nr-cs__option--active',
                disabled && 'nr-cs__option--disabled'
              )}
              onMouseEnter={() => {
                if (disabled || isMobile) return;
                if (group) onOpen(level, option);
                else onOpen(level, null);
              }}
              onClick={() => {
                if (disabled) return;
                if (group) onOpen(level, option);
                else onSelect(option);
              }}
              onKeyDown={(event) => handleKeyDown(event, index, option, group)}
            >
              <span className="nr-cs__option-label">
                {itemTemplate ? itemTemplate(option, { level, group }) : label}
              </span>
              {group ? (
                <span className="nr-cs__option-arrow" aria-hidden="true">
                  {isMobile ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </span>
              ) : null}
            </button>

            {isOpen ? (
              <div className="nr-cs__sublist">
                <CascadeSublist
                  options={getChildOptions(option, level, optionGroupChildren)}
                  level={level + 1}
                  config={config}
                  openPath={openPath}
                  onOpen={onOpen}
                  onBack={onBack}
                  onSelect={onSelect}
                  onClose={onClose}
                  focusReq={focusReq}
                  setFocusReq={setFocusReq}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function CascadeSelect(props) {
  const {
    value: controlledValue,
    defaultValue = null,
    options = [],
    optionLabel = 'label',
    optionValue,
    optionGroupLabel = 'label',
    optionGroupChildren,
    onChange,
    placeholder,
    disabled = false,
    invalid = false,
    locale,
    rtl,
    theme = 'light',
    colors,
    itemTemplate,
    valueTemplate,
    floatLabel = false,
    label,
    inputId: inputIdProp,
    name,
    className,
    style,
    panelClassName,
    panelStyle,
    breakpoint = '767px',
    scrollHeight = '300px',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  } = props;

  const generatedId = useId();
  const inputId = inputIdProp ?? `nr-cs-${generatedId}`;
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState([]);
  const [focusReq, setFocusReq] = useState(null);

  const isDark = theme === 'dark';
  const isMobile = useBreakpoint(breakpoint);
  const resolvedLocale = resolveCascadeSelectLocale(locale, rtl);
  const localeConfig = useMemo(
    () => getCascadeSelectLocaleConfig(resolvedLocale),
    [resolvedLocale]
  );
  const isRtl = rtl ?? isCascadeSelectRtlLocale(resolvedLocale);
  const resolvedPlaceholder = placeholder ?? localeConfig.placeholder;
  const themeVars = useMemo(
    () => ({
      ...cascadeSelectColorsToCssVars(resolveCascadeSelectThemeColors(theme, colors)),
      ...(scrollHeight ? { '--nr-cs-scroll-height': scrollHeight } : {}),
    }),
    [theme, colors, scrollHeight]
  );

  const config = useMemo(
    () => ({
      optionLabel,
      optionGroupLabel,
      optionGroupChildren: normalizeGroupChildren(optionGroupChildren),
      optionValue,
      itemTemplate,
      rtl: isRtl,
      isMobile,
    }),
    [optionLabel, optionGroupLabel, optionGroupChildren, optionValue, itemTemplate, isRtl, isMobile]
  );

  const selectedLabel = useMemo(
    () => findSelectedLabel(options, value, config),
    [options, value, config]
  );

  const close = useCallback(() => {
    setOpen(false);
    setOpenPath([]);
    setFocusReq(null);
  }, []);

  useClickOutside([rootRef], close, open);

  const openPanel = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setOpenPath([]);
    const firstOption = options[0];
    if (firstOption) setFocusReq({ level: 0, option: firstOption });
  }, [disabled, options]);

  useEffect(() => {
    if (!open) return;
    setOpenPath([]);
    setFocusReq(options[0] ? { level: 0, option: options[0] } : null);
  }, [isMobile]);

  const handleSelect = useCallback(
    (option) => {
      const nextValue = getOptionValue(option, optionValue);
      if (!isControlled) setInternalValue(nextValue);
      onChange?.({ value: nextValue, option });
      close();
      triggerRef.current?.focus();
    },
    [close, isControlled, onChange, optionValue]
  );

  const handleOpen = useCallback((level, option) => {
    setOpenPath((prev) => {
      if (option == null) return prev.slice(0, level);
      return [...prev.slice(0, level), option];
    });
  }, []);

  const handleBack = useCallback(
    (level) => {
      setFocusReq({ level: level - 1, option: openPath[level - 1] });
      setOpenPath((prev) => prev.slice(0, level - 1));
    },
    [openPath]
  );

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPanel();
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!open) return;
    setOpenPath([]);
    setFocusReq(options[0] ? { level: 0, option: options[0] } : null);
  }, [isMobile]);

  const hasValue = value != null && value !== '';
  const displayLabel = hasValue
    ? valueTemplate
      ? valueTemplate(value, selectedLabel)
      : selectedLabel
    : null;

  const trigger = (
    <div
      ref={triggerRef}
      id={inputId}
      role="combobox"
      aria-haspopup="tree"
      aria-expanded={open}
      aria-controls={open ? `${inputId}-panel` : undefined}
      aria-label={ariaLabel ?? localeConfig.ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className="nr-cs__trigger"
      onClick={() => (open ? close() : openPanel())}
      onKeyDown={handleTriggerKeyDown}
    >
      <span className={cn('nr-cs__value', !hasValue && 'nr-cs__value--placeholder')}>
        {hasValue ? displayLabel : floatLabel ? '\u00a0' : resolvedPlaceholder}
      </span>
      <span className="nr-cs__trigger-icon" aria-hidden="true">
        <ChevronDownIcon />
      </span>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        'nr-cs',
        isRtl && 'nr-cs--rtl',
        isDark && 'nr-cs--dark',
        isMobile && 'nr-cs--mobile',
        disabled && 'nr-cs--disabled',
        invalid && 'nr-cs--invalid',
        open && 'nr-cs--open',
        floatLabel && 'nr-cs--float',
        className
      )}
      style={{ ...themeVars, ...style }}
      dir={isRtl ? 'rtl' : undefined}
    >
      {floatLabel ? (
        <div
          className={cn(
            'nr-cs__float-wrapper',
            (hasValue || open) && 'nr-cs__float-wrapper--filled',
            open && 'nr-cs__float-wrapper--focused'
          )}
        >
          {trigger}
          <label htmlFor={inputId} className="nr-cs__float-label">
            {label ?? resolvedPlaceholder}
          </label>
        </div>
      ) : (
        trigger
      )}

      {name ? (
        <input
          type="hidden"
          name={name}
          value={value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)}
        />
      ) : null}

      {open ? (
        <div
          id={`${inputId}-panel`}
          className={cn('nr-cs-panel', isDark && 'nr-cs-panel--dark', panelClassName)}
          style={{ ...themeVars, ...panelStyle }}
          role="tree"
        >
          <CascadeSublist
            options={options}
            level={0}
            config={config}
            openPath={openPath}
            onOpen={handleOpen}
            onBack={handleBack}
            onSelect={handleSelect}
            onClose={() => {
              close();
              triggerRef.current?.focus();
            }}
            focusReq={focusReq}
            setFocusReq={setFocusReq}
          />
        </div>
      ) : null}
    </div>
  );
}

export default CascadeSelect;
