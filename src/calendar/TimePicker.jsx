import React from 'react';
import { cn } from './utils/cn.js';
import { formatLocaleText } from './utils/locale.js';

function TimeSpinner({
  label,
  value,
  min,
  max,
  step = 1,
  locale,
  disabled,
  onChange,
}) {
  const decrease = () => {
    if (disabled) return;
    const next = value - step;
    onChange(next < min ? max - (min - next - 1) : next);
  };

  const increase = () => {
    if (disabled) return;
    const next = value + step;
    onChange(next > max ? min + (next - max - 1) : next);
  };

  return (
    <div className="nr-calendar__time-column">
      <span className="nr-calendar__time-label">{label}</span>
      <button type="button" className="nr-calendar__time-btn" onClick={increase} disabled={disabled} aria-label={`Increase ${label}`}>▲</button>
      <span className="nr-calendar__time-value">{formatLocaleText(String(value).padStart(2, '0'), locale)}</span>
      <button type="button" className="nr-calendar__time-btn" onClick={decrease} disabled={disabled} aria-label={`Decrease ${label}`}>▼</button>
    </div>
  );
}

export function TimePicker({
  value,
  locale,
  localeConfig,
  hourFormat = '24',
  disabled = false,
  showSeconds = false,
  onChange,
}) {
  const date = value instanceof Date ? value : new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const is12 = hourFormat === '12';
  const displayHour = is12 ? (hours % 12 || 12) : hours;
  const period = hours >= 12 ? 'pm' : 'am';

  const update = (patch) => {
    const next = new Date(date);
    if (patch.hours != null) next.setHours(patch.hours);
    if (patch.minutes != null) next.setMinutes(patch.minutes);
    if (patch.seconds != null) next.setSeconds(patch.seconds);
    onChange?.(next);
  };

  const setHour = (nextHour) => {
    if (!is12) {
      update({ hours: nextHour });
      return;
    }
    let next = nextHour % 12;
    if (period === 'pm') next += 12;
    update({ hours: next });
  };

  const togglePeriod = () => {
    update({ hours: (hours + 12) % 24 });
  };

  return (
    <div className={cn('nr-calendar__time', is12 && 'nr-calendar__time--12h')}>
      <TimeSpinner
        label={localeConfig.hour}
        value={displayHour}
        min={is12 ? 1 : 0}
        max={is12 ? 12 : 23}
        locale={locale}
        disabled={disabled}
        onChange={setHour}
      />
      <TimeSpinner
        label={localeConfig.minute}
        value={minutes}
        min={0}
        max={59}
        locale={locale}
        disabled={disabled}
        onChange={(next) => update({ minutes: next })}
      />
      {showSeconds ? (
        <TimeSpinner
          label={localeConfig.second}
          value={seconds}
          min={0}
          max={59}
          locale={locale}
          disabled={disabled}
          onChange={(next) => update({ seconds: next })}
        />
      ) : null}
      {is12 ? (
        <button type="button" className="nr-calendar__ampm" onClick={togglePeriod} disabled={disabled}>
          {localeConfig[period]}
        </button>
      ) : null}
    </div>
  );
}
