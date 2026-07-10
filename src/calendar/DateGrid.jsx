import React, { useMemo } from 'react';
import { cn } from './utils/cn.js';
import {
  addMonths,
  fromCalendarParts,
  getMonthLength,
  getWeekday,
  isDateInRange,
  sameDay,
  today,
} from './utils/calendarDate.js';
import { formatLocaleText } from './utils/locale.js';

function buildMonthDays(year, month, system, firstDayOfWeek) {
  const daysInMonth = getMonthLength(year, month, system);
  const startWeekday = getWeekday(year, month, 1, system);
  const offset = (startWeekday - firstDayOfWeek + 7) % 7;
  const cells = [];

  for (let i = 0; i < offset; i += 1) cells.push(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ year, month, day });
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isSelectedDay(date, value, selectionMode) {
  if (!date) return false;
  if (selectionMode === 'multiple') {
    return Array.isArray(value) && value.some((item) => sameDay(item, date));
  }
  if (selectionMode === 'range') {
    if (!Array.isArray(value) || !value.length) return false;
    const [start, end] = value;
    if (!start) return false;
    if (!end) return sameDay(date, start);
    const time = date.getTime();
    const min = Math.min(start.getTime(), end.getTime());
    const max = Math.max(start.getTime(), end.getTime());
    return time >= min && time <= max;
  }
  return sameDay(date, value);
}

function isRangeEdge(date, value, selectionMode) {
  if (selectionMode !== 'range' || !Array.isArray(value)) return false;
  return value.some((item) => sameDay(item, date));
}

export function DateGrid({
  viewYear,
  viewMonth,
  calendarSystem,
  locale,
  localeConfig,
  value,
  selectionMode = 'single',
  minDate,
  maxDate,
  disabled = false,
  showWeek = false,
  onSelectDay,
}) {
  const now = today();
  const cells = useMemo(
    () => buildMonthDays(viewYear, viewMonth, calendarSystem, localeConfig.firstDayOfWeek),
    [viewYear, viewMonth, calendarSystem, localeConfig.firstDayOfWeek]
  );

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <table className="nr-calendar__table" role="grid">
      <thead>
        <tr>
          {showWeek ? <th className="nr-calendar__week-header">{localeConfig.weekHeader}</th> : null}
          {localeConfig.dayNamesMin.map((day) => (
            <th key={day} scope="col" className="nr-calendar__weekday">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {showWeek ? (
              <td className="nr-calendar__week-number">
                {formatLocaleText(weekIndex + 1, locale)}
              </td>
            ) : null}
            {week.map((cell, index) => {
              if (!cell) {
                return <td key={`empty-${index}`} className="nr-calendar__day nr-calendar__day--empty" />;
              }

              const date = fromCalendarParts(cell, calendarSystem);
              const outOfRange = !isDateInRange(date, minDate, maxDate);
              const selected = isSelectedDay(date, value, selectionMode);
              const isToday = sameDay(date, now);
              const rangeEdge = isRangeEdge(date, value, selectionMode);

              return (
                <td key={`${cell.year}-${cell.month}-${cell.day}`} className="nr-calendar__day-cell">
                  <button
                    type="button"
                    className={cn(
                      'nr-calendar__day',
                      selected && 'nr-calendar__day--selected',
                      rangeEdge && 'nr-calendar__day--range-edge',
                      isToday && 'nr-calendar__day--today',
                      outOfRange && 'nr-calendar__day--disabled'
                    )}
                    disabled={disabled || outOfRange}
                    onClick={() => onSelectDay?.(date)}
                    aria-pressed={selected || undefined}
                    aria-current={isToday ? 'date' : undefined}
                  >
                    {formatLocaleText(cell.day, locale)}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function getAdjacentMonth(year, month, offset, system) {
  return addMonths(year, month, offset, system);
}
