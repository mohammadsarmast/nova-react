import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './CalendarIcons.jsx';
import { DateGrid, getAdjacentMonth } from './DateGrid.jsx';
import { MonthGrid } from './MonthGrid.jsx';
import { TimePicker } from './TimePicker.jsx';
import { YearGrid } from './YearGrid.jsx';
import { cn } from './utils/cn.js';
import { addMonths, addYears, toCalendarParts } from './utils/calendarDate.js';
import { formatLocaleText } from './utils/locale.js';
import {
  resolvePanelView,
  shouldShowDateSection,
  shouldShowTimeSection,
} from './utils/mode.js';

export function CalendarPanel({
  id,
  mode,
  panelView,
  onPanelViewChange,
  viewYear,
  viewMonth,
  onViewChange,
  calendarSystem,
  locale,
  localeConfig,
  value,
  selectionMode,
  minDate,
  maxDate,
  disabled,
  showWeek,
  showButtonBar,
  hourFormat,
  showSeconds,
  numberOfMonths = 1,
  onSelectDay,
  onSelectMonth,
  onSelectYear,
  onTimeChange,
  onToday,
  onClear,
  className,
}) {
  const currentView = resolvePanelView(mode, panelView);
  const showDate = shouldShowDateSection(mode);
  const showTime = shouldShowTimeSection(mode);

  const titleMonth = localeConfig.monthNames[viewMonth - 1];
  const title = currentView === 'year'
    ? `${formatLocaleText(viewYear - 5, locale)} - ${formatLocaleText(viewYear + 6, locale)}`
    : `${formatLocaleText(titleMonth, locale)} ${formatLocaleText(viewYear, locale)}`;

  const navigateMonth = (offset) => {
    const next = getAdjacentMonth(viewYear, viewMonth, offset, calendarSystem);
    onViewChange?.(next.year, next.month);
  };

  const navigateYear = (offset) => {
    const next = addYears(viewYear, offset);
    onViewChange?.(next.year, viewMonth);
  };

  const navigateDecade = (offset) => {
    onViewChange?.(viewYear + offset * 10, viewMonth);
  };

  const months = Array.from({ length: numberOfMonths }, (_, index) => {
    const shifted = addMonths(viewYear, viewMonth, index, calendarSystem);
    return shifted;
  });

  return (
    <div id={id} className={cn('nr-calendar-panel', className)} role="dialog" aria-modal={!showDate ? undefined : 'true'}>
      {showDate && currentView !== 'time' ? (
        <div className="nr-calendar-panel__header">
          <button
            type="button"
            className="nr-calendar-panel__nav"
            onClick={() => {
              if (currentView === 'year') navigateDecade(-1);
              else if (currentView === 'month') navigateYear(-1);
              else navigateMonth(-1);
            }}
            aria-label={currentView === 'year' ? localeConfig.prevDecade : currentView === 'month' ? localeConfig.prevYear : localeConfig.prevMonth}
          >
            <ChevronLeftIcon />
          </button>

          <div className="nr-calendar-panel__title-group">
            {currentView === 'date' ? (
              <>
                <button type="button" className="nr-calendar-panel__title-btn" onClick={() => onPanelViewChange?.('month')}>
                  {formatLocaleText(titleMonth, locale)}
                </button>
                <button type="button" className="nr-calendar-panel__title-btn" onClick={() => onPanelViewChange?.('year')}>
                  {formatLocaleText(viewYear, locale)}
                </button>
              </>
            ) : (
              <span className="nr-calendar-panel__title">{title}</span>
            )}
          </div>

          <button
            type="button"
            className="nr-calendar-panel__nav"
            onClick={() => {
              if (currentView === 'year') navigateDecade(1);
              else if (currentView === 'month') navigateYear(1);
              else navigateMonth(1);
            }}
            aria-label={currentView === 'year' ? localeConfig.nextDecade : currentView === 'month' ? localeConfig.nextYear : localeConfig.nextMonth}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}

      <div className="nr-calendar-panel__body">
        {showDate && currentView === 'date' ? (
          <div className={cn('nr-calendar-panel__months', numberOfMonths > 1 && 'nr-calendar-panel__months--multi')}>
            {months.map((monthParts) => (
              <div key={`${monthParts.year}-${monthParts.month}`} className="nr-calendar-panel__month">
                {numberOfMonths > 1 ? (
                  <div className="nr-calendar-panel__month-title">
                    {formatLocaleText(localeConfig.monthNames[monthParts.month - 1], locale)}
                    {' '}
                    {formatLocaleText(monthParts.year, locale)}
                  </div>
                ) : null}
                <DateGrid
                  viewYear={monthParts.year}
                  viewMonth={monthParts.month}
                  calendarSystem={calendarSystem}
                  locale={locale}
                  localeConfig={localeConfig}
                  value={value}
                  selectionMode={selectionMode}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabled={disabled}
                  showWeek={showWeek}
                  onSelectDay={onSelectDay}
                />
              </div>
            ))}
          </div>
        ) : null}

        {showDate && currentView === 'month' ? (
          <MonthGrid
            viewYear={viewYear}
            calendarSystem={calendarSystem}
            locale={locale}
            localeConfig={localeConfig}
            value={value}
            selectionMode={selectionMode}
            disabled={disabled}
            onSelectMonth={(month) => {
              onSelectMonth?.(month);
              if (mode === 'month') return;
              onPanelViewChange?.('date');
            }}
          />
        ) : null}

        {showDate && currentView === 'year' ? (
          <YearGrid
            viewYear={viewYear}
            calendarSystem={calendarSystem}
            locale={locale}
            value={value}
            disabled={disabled}
            onSelectYear={(year) => {
              onSelectYear?.(year);
              if (mode === 'year') return;
              onPanelViewChange?.(mode === 'month' ? 'month' : 'date');
            }}
          />
        ) : null}

        {showTime ? (
          <TimePicker
            value={Array.isArray(value) ? value[0] : value}
            locale={locale}
            localeConfig={localeConfig}
            hourFormat={hourFormat}
            disabled={disabled}
            showSeconds={showSeconds}
            onChange={onTimeChange}
          />
        ) : null}
      </div>

      {showButtonBar ? (
        <div className="nr-calendar-panel__footer">
          <button type="button" className="nr-calendar-panel__footer-btn" onClick={onToday} disabled={disabled}>
            {localeConfig.today}
          </button>
          <button type="button" className="nr-calendar-panel__footer-btn" onClick={onClear} disabled={disabled}>
            {localeConfig.clear}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function getInitialView(value, calendarSystem) {
  const parts = value ? toCalendarParts(value, calendarSystem) : toCalendarParts(new Date(), calendarSystem);
  return {
    year: parts?.year ?? new Date().getFullYear(),
    month: parts?.month ?? new Date().getMonth() + 1,
  };
}
