import React, { useState } from 'react';
import { Calendar } from 'nova-react/calendar';
import 'nova-react/calendar/styles.css';

const sectionStyle = {
  display: 'grid',
  gap: 16,
  padding: 20,
  borderRadius: 14,
  border: '1px solid #e5e7eb',
  background: '#fff',
};

const labelStyle = {
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: '#111827',
};

const hintStyle = {
  margin: 0,
  fontSize: 13,
  color: '#6b7280',
  lineHeight: 1.6,
};

function DemoBlock({ title, hint, children }) {
  return (
    <section style={sectionStyle}>
      <h3 style={labelStyle}>{title}</h3>
      {hint ? <p style={hintStyle}>{hint}</p> : null}
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

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <p style={{ marginTop: 0, color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
        PrimeReact-inspired Calendar with Gregorian, Jalali (Persian), and Hijri systems.
        Use <code>mode</code> for date, time, datetime, month, or year — alone or combined.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <DemoBlock title="Gregorian — English" hint="Default Western calendar.">
          <Calendar
            value={gregorianDate}
            onChange={(e) => setGregorianDate(e.value)}
            calendarSystem="gregorian"
            locale="en"
            showIcon
            showButtonBar
            dateFormat="dd/mm/yy"
          />
        </DemoBlock>

        <DemoBlock title="Jalali — Persian" hint="Shamsi calendar with Persian digits and RTL.">
          <Calendar
            value={jalaliDate}
            onChange={(e) => setJalaliDate(e.value)}
            calendarSystem="jalali"
            locale="fa"
            rtl
            showIcon
            showButtonBar
            dateFormat="dd/mm/yy"
          />
        </DemoBlock>

        <DemoBlock title="Hijri — Arabic" hint="Islamic calendar for Arabic locale.">
          <Calendar
            value={hijriDate}
            onChange={(e) => setHijriDate(e.value)}
            calendarSystem="hijri"
            locale="ar"
            rtl
            showIcon
            showButtonBar
            dateFormat="dd/mm/yy"
          />
        </DemoBlock>

        <DemoBlock title="Date + Time" hint="mode='datetime' with 24-hour format.">
          <Calendar
            value={dateTime}
            onChange={(e) => setDateTime(e.value)}
            mode="datetime"
            locale="fa"
            rtl
            showIcon
            showButtonBar
            hourFormat="24"
            dateFormat="dd/mm/yy"
          />
        </DemoBlock>

        <DemoBlock title="Time Only" hint="timeOnly / mode='time'.">
          <Calendar
            value={timeOnly}
            onChange={(e) => setTimeOnly(e.value)}
            mode="time"
            locale="en"
            showIcon
            hourFormat="12"
          />
        </DemoBlock>

        <DemoBlock title="Month Picker" hint="mode='month' — pick month and year.">
          <Calendar
            value={monthValue}
            onChange={(e) => setMonthValue(e.value)}
            mode="month"
            calendarSystem="jalali"
            locale="fa"
            rtl
            showIcon
            dateFormat="mm/yy"
          />
        </DemoBlock>

        <DemoBlock title="Year Picker" hint="mode='year'.">
          <Calendar
            value={yearValue}
            onChange={(e) => setYearValue(e.value)}
            mode="year"
            calendarSystem="gregorian"
            locale="en"
            showIcon
            dateFormat="yy"
          />
        </DemoBlock>

        <DemoBlock title="Range Selection" hint="selectionMode='range' with button bar.">
          <Calendar
            value={range}
            onChange={(e) => setRange(e.value)}
            selectionMode="range"
            locale="en"
            showIcon
            showButtonBar
            readOnlyInput
          />
        </DemoBlock>
      </div>

      <DemoBlock title="Inline Calendar" hint="inline panel with two months.">
        <Calendar
          value={inlineDate}
          onChange={(e) => setInlineDate(e.value)}
          inline
          numberOfMonths={2}
          calendarSystem="gregorian"
          locale="en"
          showButtonBar
          showWeek
        />
      </DemoBlock>
    </div>
  );
}
