import React, { useEffect, useState } from 'react';
import { Calendar, formatCalendarValue, getLocaleConfig } from 'nova-react/calendar';

function logCalendarOutput(label, value, system, locale) {
  const formatted = formatCalendarValue(value, {
    selectionMode: 'single',
    dateFormat: 'dd/mm/yyyy',
    mode: 'date',
    calendarSystem: system,
    locale,
    localeConfig: getLocaleConfig(locale),
  });
  console.log(`[Calendar] ${label} (${system}/${locale}) =>`, formatted, value);
}

function getStyles(isDark) {
  return {
    section: {
      display: 'grid',
      gap: 16,
      padding: 20,
      borderRadius: 14,
      border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
      background: isDark ? '#1e293b' : '#fff',
    },
    label: {
      margin: 0,
      fontSize: 15,
      fontWeight: 700,
      color: isDark ? '#f8fafc' : '#111827',
    },
    hint: {
      margin: 0,
      fontSize: 13,
      color: isDark ? '#94a3b8' : '#6b7280',
      lineHeight: 1.6,
    },
  };
}

function DemoBlock({ title, hint, children, styles }) {
  return (
    <section style={styles.section}>
      <h3 style={styles.label}>{title}</h3>
      {hint ? <p style={styles.hint}>{hint}</p> : null}
      {children}
    </section>
  );
}

export function CalendarDemo() {
  const [gregorianDate, setGregorianDate] = useState(new Date());
  const [jalaliDate, setJalaliDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date());
  const [timeOnly, setTimeOnly] = useState(new Date());
  const [monthValue, setMonthValue] = useState(new Date());
  const [yearValue, setYearValue] = useState(new Date());
  const [range, setRange] = useState([]);
  const [inlineDate, setInlineDate] = useState(new Date());
  const [theme, setTheme] = useState('light');

  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  useEffect(() => {
    logCalendarOutput('Gregorian', gregorianDate, 'gregorian', 'en');
    logCalendarOutput('Jalali', jalaliDate, 'jalali', 'fa');
    logCalendarOutput('Hijri', hijriDate, 'hijri', 'ar');
  }, [gregorianDate, jalaliDate, hijriDate]);

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        padding: 20,
        borderRadius: 16,
        background: isDark ? '#0f172a' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
          PrimeReact-inspired Calendar with Gregorian, Jalali (Persian), and Hijri systems.
          Use <code>mode</code> for date, time, datetime, month, or year — alone or combined.
        </p>
        <button
          type="button"
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f8fafc' : '#111827',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <DemoBlock title="Gregorian — English" hint="Default Western calendar." styles={styles}>
          <Calendar
            value={gregorianDate}
            onChange={(e) => setGregorianDate(e.value)}
            calendarSystem="gregorian"
            locale="en"
            theme={theme}
            showIcon
            showButtonBar
            dateFormat="dd/mm/yyyy"
          />
        </DemoBlock>

        <DemoBlock title="Jalali — Persian" hint="Shamsi calendar with Persian digits and RTL." styles={styles}>
          <Calendar
            value={jalaliDate}
            onChange={(e) => setJalaliDate(e.value)}
            calendarSystem="jalali"
            locale="fa"
            theme={theme}
            rtl
            showIcon
            showButtonBar
            dateFormat="dd/mm/yyyy"
          />
        </DemoBlock>

        <DemoBlock title="Hijri — Arabic" hint="Islamic calendar for Arabic locale." styles={styles}>
          <Calendar
            value={hijriDate}
            onChange={(e) => setHijriDate(e.value)}
            calendarSystem="hijri"
            locale="ar"
            theme={theme}
            rtl
            showIcon
            showButtonBar
            dateFormat="dd/mm/yyyy"
          />
        </DemoBlock>

        <DemoBlock title="Date + Time" hint="mode='datetime' with 24-hour format." styles={styles}>
          <Calendar
            value={dateTime}
            onChange={(e) => setDateTime(e.value)}
            mode="datetime"
            locale="fa"
            theme={theme}
            rtl
            showIcon
            showButtonBar
            hourFormat="24"
            dateFormat="dd/mm/yyyy"
          />
        </DemoBlock>

        <DemoBlock title="Time Only" hint="timeOnly / mode='time'." styles={styles}>
          <Calendar
            value={timeOnly}
            onChange={(e) => setTimeOnly(e.value)}
            mode="time"
            locale="en"
            theme={theme}
            showIcon
            hourFormat="12"
          />
        </DemoBlock>

        <DemoBlock title="Month Picker" hint="mode='month' — pick month and year." styles={styles}>
          <Calendar
            value={monthValue}
            onChange={(e) => setMonthValue(e.value)}
            mode="month"
            calendarSystem="jalali"
            locale="fa"
            theme={theme}
            rtl
            showIcon
          />
        </DemoBlock>

        <DemoBlock title="Year Picker" hint="mode='year'." styles={styles}>
          <Calendar
            value={yearValue}
            onChange={(e) => setYearValue(e.value)}
            mode="year"
            calendarSystem="gregorian"
            locale="en"
            theme={theme}
            showIcon
          />
        </DemoBlock>

        <DemoBlock title="Range Selection" hint="selectionMode='range' with button bar." styles={styles}>
          <Calendar
            value={range}
            onChange={(e) => setRange(e.value)}
            selectionMode="range"
            locale="en"
            theme={theme}
            showIcon
            showButtonBar
            readOnlyInput
          />
        </DemoBlock>
      </div>

      <DemoBlock title="Inline Calendar" hint="inline panel with two months." styles={styles}>
        <Calendar
          value={inlineDate}
          onChange={(e) => setInlineDate(e.value)}
          inline
          numberOfMonths={2}
          calendarSystem="gregorian"
          locale="en"
          theme={theme}
          showButtonBar
          showWeek
        />
      </DemoBlock>
    </div>
  );
}
