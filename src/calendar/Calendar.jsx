import React, {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CalendarIcon } from './CalendarIcons.jsx';
import { CalendarPanel, getInitialView } from './CalendarPanel.jsx';
import { useClickOutside } from './hooks/useClickOutside.js';
import { cn } from './utils/cn.js';
import {
  cloneDate,
  fromCalendarParts,
  isDateInRange,
  normalizeValue,
  resolveCalendarSystem,
  sameDay,
  setTimeOnDate,
  today,
  toCalendarParts,
} from './utils/calendarDate.js';
import { formatCalendarValue } from './utils/format.js';
import { getLocaleConfig, resolveLocale } from './utils/locale.js';
import { resolveCalendarMode, resolvePanelView } from './utils/mode.js';
import './styles/calendar.css';

function applyDaySelection(date, value, selectionMode) {
  if (selectionMode === 'multiple') {
    const list = Array.isArray(value) ? [...value] : [];
    const index = list.findIndex((item) => sameDay(item, date));
    if (index >= 0) list.splice(index, 1);
    else list.push(cloneDate(date));
    return list;
  }

  if (selectionMode === 'range') {
    const list = Array.isArray(value) ? [...value] : [];
    if (!list.length || list.length === 2) return [cloneDate(date)];
    const sorted = [list[0], date].sort((a, b) => a.getTime() - b.getTime());
    return [cloneDate(sorted[0]), cloneDate(sorted[1])];
  }

  return cloneDate(date);
}

function mergeDateWithTime(date, timeSource) {
  if (!timeSource) return date;
  return setTimeOnDate(
    date,
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    timeSource.getMilliseconds()
  );
}

export function Calendar({
  value,
  onChange,
  calendarSystem,
  locale,
  rtl,
  mode,
  view,
  showTime = false,
  timeOnly = false,
  selectionMode = 'single',
  dateFormat,
  timeFormat = 'HH:mm',
  showIcon = false,
  showButtonBar = false,
  showWeek = false,
  showSeconds = false,
  hourFormat = '24',
  minDate,
  maxDate,
  disabled = false,
  readOnlyInput = false,
  inline = false,
  numberOfMonths = 1,
  placeholder,
  inputId,
  name,
  className,
  inputClassName,
  panelClassName,
  icon,
  onShow,
  onHide,
  onFocus,
  onBlur,
}) {
  const generatedId = useId();
  const resolvedInputId = inputId ?? generatedId;
  const panelId = `${resolvedInputId}-panel`;
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const resolvedLocale = resolveLocale(locale, rtl);
  const localeConfig = useMemo(() => getLocaleConfig(resolvedLocale), [resolvedLocale]);
  const resolvedSystem = resolveCalendarSystem(calendarSystem, resolvedLocale);
  const resolvedMode = resolveCalendarMode({ mode, view, showTime, timeOnly });
  const isRtl = rtl ?? ['fa', 'ar'].includes(resolvedLocale);

  const normalizedValue = normalizeValue(value, selectionMode);
  const initialView = getInitialView(
    selectionMode === 'single' ? normalizedValue : normalizedValue?.[0],
    resolvedSystem
  );

  const [open, setOpen] = useState(inline);
  const [panelView, setPanelView] = useState(resolvePanelView(resolvedMode));
  const [viewYear, setViewYear] = useState(initialView.year);
  const [viewMonth, setViewMonth] = useState(initialView.month);
  const [draftValue, setDraftValue] = useState(normalizedValue);

  const displayValue = open ? draftValue : normalizedValue;
  const effectiveDateFormat = dateFormat ?? (resolvedMode === 'year' ? 'yy' : resolvedMode === 'month' ? 'mm/yy' : 'mm/dd/yy');

  const formattedValue = formatCalendarValue(displayValue, {
    selectionMode,
    dateFormat: effectiveDateFormat,
    timeFormat,
    mode: resolvedMode,
    timeOnly,
    calendarSystem: resolvedSystem,
    locale: resolvedLocale,
    hourFormat,
    localeConfig,
  });

  const emitChange = useCallback((next, originalEvent) => {
    onChange?.({ value: next, originalEvent });
  }, [onChange]);

  const closePanel = useCallback(() => {
    if (inline) return;
    setOpen(false);
    onHide?.();
  }, [inline, onHide]);

  const openPanel = useCallback(() => {
    if (disabled) return;
    setDraftValue(normalizedValue);
    const nextView = getInitialView(
      selectionMode === 'single' ? normalizedValue : normalizedValue?.[0],
      resolvedSystem
    );
    setViewYear(nextView.year);
    setViewMonth(nextView.month);
    setPanelView(resolvePanelView(resolvedMode));
    setOpen(true);
    onShow?.();
  }, [disabled, normalizedValue, onShow, resolvedMode, resolvedSystem, selectionMode]);

  useClickOutside([rootRef, panelRef], closePanel, open && !inline);

  const commitValue = useCallback((next, originalEvent, shouldClose = true) => {
    setDraftValue(next);
    emitChange(next, originalEvent);
    if (shouldClose && !inline && selectionMode === 'single' && resolvedMode !== 'datetime' && resolvedMode !== 'time') {
      closePanel();
    }
  }, [closePanel, emitChange, inline, resolvedMode, selectionMode]);

  const handleSelectDay = useCallback((date, event) => {
    if (!isDateInRange(date, minDate, maxDate)) return;
    const base = selectionMode === 'single'
      ? mergeDateWithTime(date, displayValue instanceof Date ? displayValue : null)
      : date;
    const next = applyDaySelection(base, displayValue, selectionMode);
    commitValue(next, event);
  }, [commitValue, displayValue, maxDate, minDate, selectionMode]);

  const handleSelectMonth = useCallback((month) => {
    const parts = toCalendarParts(displayValue instanceof Date ? displayValue : today(), resolvedSystem)
      ?? toCalendarParts(today(), resolvedSystem);
    const nextDate = fromCalendarParts({
      year: viewYear,
      month,
      day: 1,
      hours: parts.hours,
      minutes: parts.minutes,
      seconds: parts.seconds,
    }, resolvedSystem);
    if (resolvedMode === 'month') {
      commitValue(nextDate);
      return;
    }
    setViewMonth(month);
    setDraftValue(nextDate);
  }, [commitValue, displayValue, resolvedMode, resolvedSystem, viewYear]);

  const handleSelectYear = useCallback((year) => {
    const parts = toCalendarParts(displayValue instanceof Date ? displayValue : today(), resolvedSystem)
      ?? toCalendarParts(today(), resolvedSystem);
    const nextDate = fromCalendarParts({
      year,
      month: parts.month,
      day: 1,
      hours: parts.hours,
      minutes: parts.minutes,
      seconds: parts.seconds,
    }, resolvedSystem);
    if (resolvedMode === 'year') {
      commitValue(nextDate);
      return;
    }
    setViewYear(year);
    setDraftValue(nextDate);
  }, [commitValue, displayValue, resolvedMode, resolvedSystem]);

  const handleTimeChange = useCallback((nextTime) => {
    const base = displayValue instanceof Date
      ? cloneDate(displayValue)
      : today();
    const merged = setTimeOnDate(
      base,
      nextTime.getHours(),
      nextTime.getMinutes(),
      nextTime.getSeconds(),
      nextTime.getMilliseconds()
    );
    setDraftValue(merged);
    if (resolvedMode === 'time') commitValue(merged, undefined, true);
  }, [commitValue, displayValue, resolvedMode]);

  const handleToday = useCallback(() => {
    const now = today();
    commitValue(
      selectionMode === 'multiple' ? [now]
        : selectionMode === 'range' ? [now, now]
          : now
    );
  }, [commitValue, selectionMode]);

  const handleClear = useCallback(() => {
    const cleared = selectionMode === 'single' ? null : [];
    commitValue(cleared);
  }, [commitValue, selectionMode]);

  const panel = (
    <CalendarPanel
      id={panelId}
      mode={resolvedMode}
      panelView={panelView}
      onPanelViewChange={setPanelView}
      viewYear={viewYear}
      viewMonth={viewMonth}
      onViewChange={(year, month) => {
        setViewYear(year);
        setViewMonth(month);
      }}
      calendarSystem={resolvedSystem}
      locale={resolvedLocale}
      localeConfig={localeConfig}
      value={displayValue}
      selectionMode={selectionMode}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      showWeek={showWeek}
      showButtonBar={showButtonBar}
      hourFormat={hourFormat}
      showSeconds={showSeconds}
      numberOfMonths={numberOfMonths}
      onSelectDay={handleSelectDay}
      onSelectMonth={handleSelectMonth}
      onSelectYear={handleSelectYear}
      onTimeChange={handleTimeChange}
      onToday={handleToday}
      onClear={handleClear}
      className={panelClassName}
    />
  );

  if (inline) {
    return (
      <div
        ref={rootRef}
        className={cn('nr-calendar', 'nr-calendar--inline', isRtl && 'nr-calendar--rtl', disabled && 'nr-calendar--disabled', className)}
        dir={isRtl ? 'rtl' : undefined}
      >
        {panel}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        'nr-calendar',
        showIcon && 'nr-calendar--with-icon',
        isRtl && 'nr-calendar--rtl',
        disabled && 'nr-calendar--disabled',
        open && 'nr-calendar--open',
        className
      )}
      dir={isRtl ? 'rtl' : undefined}
    >
      <div className="nr-calendar__input-wrap">
        <input
          ref={inputRef}
          id={resolvedInputId}
          name={name}
          type="text"
          className={cn('nr-calendar__input', inputClassName)}
          value={formattedValue}
          placeholder={placeholder ?? localeConfig.placeholder}
          readOnly={readOnlyInput}
          disabled={disabled}
          autoComplete="off"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          onFocus={(event) => {
            onFocus?.(event);
            openPanel();
          }}
          onClick={openPanel}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (event.key === 'Escape') closePanel();
          }}
        />
        {showIcon ? (
          <button
            type="button"
            className="nr-calendar__icon-btn"
            onClick={openPanel}
            disabled={disabled}
            aria-label={localeConfig.chooseDate}
            tabIndex={-1}
          >
            {icon ?? <CalendarIcon />}
          </button>
        ) : null}
      </div>

      {open ? (
        <div ref={panelRef} className="nr-calendar__overlay">
          {panel}
        </div>
      ) : null}
    </div>
  );
}

export default Calendar;
