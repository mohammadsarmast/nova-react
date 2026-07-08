import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from './hooks/useClickOutside.js';
import { useDebouncedCallback } from './hooks/useDebounce.js';
import { useVirtualScroll } from './hooks/useVirtualScroll.js';
import {
  cn,
  filterOptions,
  flattenGroupedOptions,
  getOptionLabel,
  isEqualOption,
} from './utils/index.js';
import { highlightText } from './utils/highlight.jsx';
import './styles/autocomplete.css';

const PANEL_MAX_HEIGHT = 280;
const DEFAULT_DELAY = 300;
const DEFAULT_MIN_LENGTH = 1;

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

function ChipRemoveIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

export function AutoComplete(props) {
  const {
    value: controlledValue,
    defaultValue,
    options,
    suggestions: externalSuggestions,
    completeMethod,
    onChange,
    onSelect,
    onShow,
    onHide,
    onClear,
    onInputChange,
    field,
    multiple = false,
    selectionLimit,
    forceSelection = false,
    allowCustomValue = false,
    dropdown = false,
    dropdownMode = 'blank',
    dropdownIcon,
    optionGroupLabel,
    optionGroupChildren,
    itemTemplate,
    selectedItemTemplate,
    optionGroupTemplate,
    panelHeaderTemplate,
    panelFooterTemplate,
    emptyMessage = 'No results found',
    loadingMessage = 'Loading...',
    virtualScrollerOptions,
    highlightMatches = true,
    filter: enableFilter = true,
    filterFunction,
    delay = DEFAULT_DELAY,
    minLength = DEFAULT_MIN_LENGTH,
    maxSuggestions,
    showClear = true,
    loading: externalLoading = false,
    disabled = false,
    invalid = false,
    readOnly = false,
    size = 'md',
    rtl = false,
    label,
    helperText,
    errorMessage,
    floatLabel = false,
    placeholder,
    inputId: inputIdProp,
    name,
    className,
    inputClassName,
    panelClassName,
    style,
    inputStyle,
    panelStyle,
    inputRef: externalInputRef,
    autoFocus = false,
    autoHighlight = true,
    selectOnBlur = false,
    hideOnSelect = true,
    appendTo = 'self',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
  } = props;

  const generatedId = useId();
  const inputId = inputIdProp ?? `rpa-${generatedId}`;
  const listboxId = `${inputId}-listbox`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);

  useImperativeHandle(externalInputRef, () => inputRef.current);

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (multiple ? [] : null)
  );
  const value = isControlled ? controlledValue : internalValue;

  const [inputValue, setInputValue] = useState('');
  const [panelVisible, setPanelVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalSuggestions, setInternalSuggestions] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const loading = externalLoading || internalLoading;

  const isGrouped = !!(optionGroupLabel && optionGroupChildren);

  const groupedData = useMemo(() => {
    if (!isGrouped || !options) return null;
    return flattenGroupedOptions(options, optionGroupLabel, optionGroupChildren);
  }, [isGrouped, options, optionGroupLabel, optionGroupChildren]);

  const rawSuggestions = externalSuggestions ?? internalSuggestions;

  const displaySuggestions = useMemo(() => {
    let items = rawSuggestions;

    if (options && enableFilter && !completeMethod) {
      const source = isGrouped ? groupedData.flat : options;
      items = filterOptions(source, inputValue, field, filterFunction, maxSuggestions);
    } else if (maxSuggestions && items.length > maxSuggestions) {
      items = items.slice(0, maxSuggestions);
    }

    return items;
  }, [
    rawSuggestions,
    options,
    enableFilter,
    completeMethod,
    isGrouped,
    groupedData,
    inputValue,
    field,
    filterFunction,
    maxSuggestions,
  ]);

  const groupHeaders = useMemo(() => {
    if (!isGrouped || !groupedData) return new Map();
    const map = new Map();
    let flatIndex = 0;
    options?.forEach((group) => {
      const groupLabel = getOptionLabel(group, optionGroupLabel);
      const children = group[optionGroupChildren];
      if (Array.isArray(children)) {
        map.set(flatIndex, groupLabel);
        flatIndex += children.length;
      }
    });
    return map;
  }, [isGrouped, groupedData, options, optionGroupLabel, optionGroupChildren]);

  const virtualEnabled = !!virtualScrollerOptions;
  const itemSize = virtualScrollerOptions?.itemSize ?? 38;
  const { state: virtualState, onScroll: onVirtualScroll, reset: resetVirtual } =
    useVirtualScroll(
      displaySuggestions.length,
      itemSize,
      PANEL_MAX_HEIGHT
    );

  const visibleItems = virtualEnabled
    ? displaySuggestions.slice(virtualState.startIndex, virtualState.endIndex + 1)
    : displaySuggestions;

  const visibleOffset = virtualEnabled ? virtualState.startIndex : 0;

  const updateValue = useCallback(
    (newValue, event) => {
      if (!isControlled) setInternalValue(newValue);
      onChange?.({ value: newValue, originalEvent: event });
    },
    [isControlled, onChange]
  );

  const debouncedComplete = useDebouncedCallback(
    async (query, event) => {
      if (!completeMethod) return;
      setInternalLoading(true);
      try {
        await completeMethod({ query, originalEvent: event });
      } finally {
        setInternalLoading(false);
      }
    },
    delay
  );

  const triggerSearch = useCallback(
    (query, event) => {
      if (query.length < minLength && dropdownMode !== 'blank') {
        setInternalSuggestions([]);
        return;
      }

      if (completeMethod) {
        debouncedComplete(query, event);
      } else if (options && enableFilter) {
        const source = isGrouped ? groupedData.flat : options;
        setInternalSuggestions(
          filterOptions(source, query, field, filterFunction, maxSuggestions)
        );
      }
    },
    [
      minLength,
      dropdownMode,
      completeMethod,
      debouncedComplete,
      options,
      enableFilter,
      isGrouped,
      groupedData,
      field,
      filterFunction,
      maxSuggestions,
    ]
  );

  const showPanel = useCallback(() => {
    if (disabled || readOnly) return;
    setPanelVisible(true);
    onShow?.();
    if (appendTo === 'body' && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [disabled, readOnly, onShow, appendTo]);

  const hidePanel = useCallback(() => {
    setPanelVisible(false);
    setHighlightedIndex(-1);
    resetVirtual();
    onHide?.();
  }, [onHide, resetVirtual]);

  useClickOutside(
    [rootRef, panelRef],
    () => {
      if (panelVisible) hidePanel();
    },
    panelVisible
  );

  const getDisplayValue = useCallback(
    (val) => {
      if (val == null) return '';
      return getOptionLabel(val, field);
    },
    [field]
  );

  const selectedValues = useMemo(() => {
    if (!multiple) return [];
    return Array.isArray(value) ? value : [];
  }, [multiple, value]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    onInputChange?.(query);

    if (!multiple) {
      if (allowCustomValue) {
        updateValue(query, e);
      }
    }

    triggerSearch(query, e);
    showPanel();
    setHighlightedIndex(autoHighlight ? 0 : -1);
  };

  const selectItem = (item, event) => {
    onSelect?.({ value: item, originalEvent: event });

    if (multiple) {
      const current = [...selectedValues];
      const exists = current.some((v) => isEqualOption(v, item, field));
      if (!exists) {
        if (selectionLimit && current.length >= selectionLimit) return;
        current.push(item);
        updateValue(current, event);
      }
      setInputValue('');
    } else {
      updateValue(item, event);
      setInputValue(getDisplayValue(item));
      if (hideOnSelect) hidePanel();
    }

    inputRef.current?.focus();
  };

  const removeChip = (index, event) => {
    const current = [...selectedValues];
    current.splice(index, 1);
    updateValue(current, event);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (multiple) {
      updateValue([], e);
    } else {
      updateValue(null, e);
    }
    setInputValue('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    if (panelVisible) {
      hidePanel();
      return;
    }
    const query = dropdownMode === 'current' ? inputValue : '';
    if (dropdownMode === 'blank') setInputValue('');
    triggerSearch(query, e);
    showPanel();
    setHighlightedIndex(autoHighlight ? 0 : -1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!panelVisible && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      showPanel();
      triggerSearch(inputValue, e);
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < displaySuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      }
      case 'Home': {
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        setHighlightedIndex(displaySuggestions.length - 1);
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (highlightedIndex >= 0 && displaySuggestions[highlightedIndex]) {
          selectItem(displaySuggestions[highlightedIndex], e);
        } else if (allowCustomValue && inputValue.trim()) {
          if (multiple) {
            const current = [...selectedValues];
            if (!selectionLimit || current.length < selectionLimit) {
              current.push(inputValue);
              updateValue(current, e);
              setInputValue('');
            }
          } else {
            updateValue(inputValue, e);
            if (hideOnSelect) hidePanel();
          }
        }
        break;
      }
      case 'Escape': {
        hidePanel();
        break;
      }
      case 'Tab': {
        if (panelVisible && highlightedIndex >= 0 && displaySuggestions[highlightedIndex]) {
          selectItem(displaySuggestions[highlightedIndex], e);
        }
        hidePanel();
        break;
      }
      case 'Backspace': {
        if (multiple && !inputValue && selectedValues.length > 0) {
          removeChip(selectedValues.length - 1, e);
        }
        break;
      }
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);

    if (forceSelection && !multiple && inputValue) {
      const match = displaySuggestions.find(
        (s) => getOptionLabel(s, field).toLowerCase() === inputValue.toLowerCase()
      );
      if (match) {
        updateValue(match, e);
        setInputValue(getDisplayValue(match));
      } else {
        setInputValue(getDisplayValue(value));
        if (!allowCustomValue) {
          updateValue(null, e);
        }
      }
    } else if (selectOnBlur && highlightedIndex >= 0 && displaySuggestions[highlightedIndex]) {
      selectItem(displaySuggestions[highlightedIndex], e);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (inputValue.length >= minLength || options) {
      triggerSearch(inputValue, { type: 'focus' });
      showPanel();
    }
  };

  useEffect(() => {
    if (!multiple && value != null && !isFocused) {
      setInputValue(getDisplayValue(value));
    }
  }, [value, multiple, field, isFocused, getDisplayValue]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const hasValue = multiple
    ? selectedValues.length > 0
    : value != null && value !== '';

  const showClearBtn = showClear && hasValue && !disabled && !readOnly;

  const describedBy = cn(
    ariaDescribedby,
    helperText && helperId,
    invalid && errorMessage && errorId
  );

  const renderItem = (item, index) => {
    const itemLabel = getOptionLabel(item, field);
    const isHighlighted = index === highlightedIndex;
    const isSelected = multiple
      ? selectedValues.some((v) => isEqualOption(v, item, field))
      : isEqualOption(value, item, field);

    const groupLabel = groupHeaders.get(index);

    return (
      <li key={index} role="presentation">
        {groupLabel && (
          <div
            className="rpa-item rpa-item--group-header"
            role="presentation"
          >
            {optionGroupTemplate
              ? optionGroupTemplate(options.find(
                  (g) => getOptionLabel(g, optionGroupLabel) === groupLabel
                ))
              : groupLabel}
          </div>
        )}
        <div
          id={`${inputId}-option-${index}`}
          role="option"
          aria-selected={isSelected}
          data-index={index}
          className={cn(
            'rpa-item',
            isHighlighted && 'rpa-item--highlighted',
            isSelected && 'rpa-item--selected'
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => selectItem(item, e)}
          onMouseEnter={() => setHighlightedIndex(index)}
        >
          {itemTemplate
            ? itemTemplate(item, index)
            : highlightMatches
              ? highlightText(itemLabel, inputValue)
              : itemLabel}
        </div>
      </li>
    );
  };

  const panelContent = (
    <div
      ref={panelRef}
      id={listboxId}
      role="listbox"
      aria-label="Suggestions"
      className={cn(
        'rpa-panel',
        appendTo === 'body' && 'rpa-panel--portal',
        panelClassName
      )}
      style={{
        ...panelStyle,
        ...(appendTo === 'body'
          ? {
              top: panelPosition.top,
              left: panelPosition.left,
              width: panelPosition.width,
              right: 'auto',
            }
          : {}),
      }}
    >
      {panelHeaderTemplate?.()}
      {loading ? (
        <div className="rpa-loading" role="status">
          <span className="rpa-spinner" />
          {loadingMessage}
        </div>
      ) : displaySuggestions.length === 0 ? (
        <div className="rpa-empty" role="status">
          {emptyMessage}
        </div>
      ) : (
        <ul
          ref={listRef}
          className={cn('rpa-list', virtualEnabled && 'rpa-list--virtual')}
          style={virtualEnabled ? { maxHeight: PANEL_MAX_HEIGHT } : undefined}
          onScroll={virtualEnabled ? onVirtualScroll : undefined}
        >
          {virtualEnabled ? (
            <li className="rpa-virtual-spacer" style={{ height: virtualState.totalHeight }}>
              <ul
                className="rpa-virtual-content"
                style={{ transform: `translateY(${virtualState.offsetY}px)` }}
              >
                {visibleItems.map((item, i) =>
                  renderItem(item, visibleOffset + i)
                )}
              </ul>
            </li>
          ) : (
            displaySuggestions.map((item, i) => renderItem(item, i))
          )}
        </ul>
      )}
      {panelFooterTemplate?.()}
    </div>
  );

  const inputElement = (
    <div
      className={cn(
        'rpa-input-wrapper',
        invalid && 'rpa-input-wrapper--invalid',
        disabled && 'rpa-input-wrapper--disabled'
      )}
    >
      {multiple && (
        <div className="rpa-chips" role="listbox" aria-orientation="horizontal">
          {selectedValues.map((chip, i) => (
            <span key={i} className="rpa-chip" role="option" aria-label={getDisplayValue(chip)}>
              <span className="rpa-chip-label">
                {selectedItemTemplate
                  ? selectedItemTemplate(chip)
                  : getDisplayValue(chip)}
              </span>
              {!disabled && (
                <button
                  type="button"
                  className="rpa-chip-remove"
                  onClick={(e) => removeChip(i, e)}
                  aria-label={`Remove ${getDisplayValue(chip)}`}
                  tabIndex={-1}
                >
                  <ChipRemoveIcon />
                </button>
              )}
            </span>
          ))}
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="text"
            role="combobox"
            className={cn('rpa-input', 'rpa-input--multiple', inputClassName)}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={selectedValues.length === 0 ? placeholder : undefined}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            style={inputStyle}
            aria-autocomplete="list"
            aria-expanded={panelVisible}
            aria-controls={listboxId}
            aria-activedescendant={
              highlightedIndex >= 0 ? `${inputId}-option-${highlightedIndex}` : undefined
            }
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={describedBy || undefined}
            aria-invalid={invalid || undefined}
            autoComplete="off"
          />
        </div>
      )}

      {!multiple && (
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          role="combobox"
          className={cn('rpa-input', inputClassName)}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          style={inputStyle}
          aria-autocomplete="list"
          aria-expanded={panelVisible}
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${inputId}-option-${highlightedIndex}` : undefined
          }
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={describedBy || undefined}
          aria-invalid={invalid || undefined}
          autoComplete="off"
        />
      )}

      <div className="rpa-actions">
        {loading && (
          <span className="rpa-btn rpa-btn--loading" aria-hidden="true">
            <span className="rpa-spinner" />
          </span>
        )}
        {showClearBtn && (
          <button
            type="button"
            className="rpa-btn rpa-btn--clear"
            onClick={handleClear}
            aria-label="Clear"
            tabIndex={-1}
          >
            <XIcon />
          </button>
        )}
        {dropdown && (
          <button
            type="button"
            className="rpa-btn rpa-btn--dropdown"
            onClick={handleDropdownClick}
            aria-label="Show suggestions"
            disabled={disabled}
            tabIndex={-1}
          >
            {dropdownIcon ?? <ChevronDownIcon />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        'rpa-root',
        `rpa-root--${size}`,
        rtl && 'rpa-root--rtl',
        className
      )}
      style={style}
    >
      {label && !floatLabel && (
        <label htmlFor={inputId} className="rpa-label">
          {label}
        </label>
      )}

      {floatLabel ? (
        <div
          className={cn(
            'rpa-float-wrapper',
            (isFocused || hasValue || inputValue) && 'rpa-float-wrapper--filled',
            isFocused && 'rpa-float-wrapper--focused'
          )}
        >
          {inputElement}
          <label htmlFor={inputId} className="rpa-float-label">
            {label ?? placeholder}
          </label>
        </div>
      ) : (
        inputElement
      )}

      {panelVisible && (
        appendTo === 'body'
          ? createPortal(panelContent, document.body)
          : panelContent
      )}

      {helperText && !invalid && (
        <span id={helperId} className="rpa-helper">
          {helperText}
        </span>
      )}
      {invalid && errorMessage && (
        <span id={errorId} className="rpa-error-msg" role="alert">
          {errorMessage}
        </span>
      )}

      <span className="rpa-sr-only" aria-live="polite">
        {displaySuggestions.length > 0
          ? `${displaySuggestions.length} suggestions available`
          : ''}
      </span>
    </div>
  );
}

export default AutoComplete;
