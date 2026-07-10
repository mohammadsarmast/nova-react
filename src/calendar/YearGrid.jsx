import React, { useMemo } from 'react';
import { cn } from './utils/cn.js';
import { toCalendarParts } from './utils/calendarDate.js';
import { formatLocaleText } from './utils/locale.js';

export function YearGrid({
  viewYear,
  calendarSystem,
  locale,
  value,
  disabled = false,
  onSelectYear,
}) {
  const startYear = Math.floor(viewYear / 10) * 10;
  const years = useMemo(() => Array.from({ length: 12 }, (_, index) => startYear - 1 + index), [startYear]);

  return (
    <div className="nr-calendar__year-grid" role="grid">
      {years.map((year) => {
        const selectedParts = value instanceof Date ? toCalendarParts(value, calendarSystem) : null;
        const selected = selectedParts?.year === year;

        return (
          <button
            key={year}
            type="button"
            className={cn('nr-calendar__year', selected && 'nr-calendar__year--selected')}
            disabled={disabled}
            onClick={() => onSelectYear?.(year)}
            aria-pressed={selected || undefined}
          >
            {formatLocaleText(year, locale)}
          </button>
        );
      })}
    </div>
  );
}

export function getDecadeStart(year) {
  return Math.floor(year / 10) * 10;
}
