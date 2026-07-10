import React from 'react';
import { cn } from './utils/cn.js';
import { toCalendarParts } from './utils/calendarDate.js';
import { formatLocaleText } from './utils/locale.js';

export function MonthGrid({
  viewYear,
  calendarSystem,
  locale,
  localeConfig,
  value,
  selectionMode = 'single',
  disabled = false,
  onSelectMonth,
}) {
  const selectedParts = value instanceof Date ? toCalendarParts(value, calendarSystem) : null;

  return (
    <div className="nr-calendar__month-grid" role="grid">
      {localeConfig.monthNamesShort.map((label, index) => {
        const month = index + 1;
        const selected = selectedParts?.year === viewYear && selectedParts?.month === month;

        return (
          <button
            key={label}
            type="button"
            className={cn('nr-calendar__month', selected && 'nr-calendar__month--selected')}
            disabled={disabled}
            onClick={() => onSelectMonth?.(month)}
            aria-pressed={selected || undefined}
          >
            {formatLocaleText(label, locale)}
          </button>
        );
      })}
    </div>
  );
}
