import React from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { CalendarDemo } from './CalendarDemo.jsx';

createRoot(document.getElementById('root')).render(
  <DemoLayout active="calendar" title="Calendar Demo" subtitle="Gregorian, Jalali, and Hijri calendars with date, time, month, and year modes.">
    <CalendarDemo />
  </DemoLayout>
);
