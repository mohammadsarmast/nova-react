import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../Calendar.jsx';
import '../styles/calendar.css';

describe('Calendar', () => {
  it('renders and emits onChange for gregorian date', () => {
    const handleChange = vi.fn();

    function Harness() {
      const [value, setValue] = useState(new Date(2024, 5, 10));
      return (
        <Calendar
          value={value}
          onChange={(event) => {
            setValue(event.value);
            handleChange(event);
          }}
          inline
          locale="en"
          calendarSystem="gregorian"
        />
      );
    }

    render(<Harness />);
    const dayButton = screen.getAllByRole('button').find((button) => button.textContent === '15');
    fireEvent.click(dayButton);
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls.at(-1)[0].value).toBeInstanceOf(Date);
  });

  it('supports jalali locale labels', () => {
    render(
      <Calendar
        inline
        locale="fa"
        calendarSystem="jalali"
        value={new Date(2024, 2, 20)}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('فروردین')).toBeInTheDocument();
  });

  it('opens month picker grid in month mode', () => {
    render(
      <Calendar
        inline
        mode="month"
        locale="fa"
        calendarSystem="jalali"
        value={new Date(2024, 2, 20)}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('فروردین')).toBeInTheDocument();
    expect(screen.getByText('اردیبهشت')).toBeInTheDocument();
  });

  it('changes month when picking from the month view', () => {
    const handleChange = vi.fn();

    function Harness() {
      const [value, setValue] = useState(new Date(2024, 0, 15));
      return (
        <Calendar
          value={value}
          onChange={(event) => {
            setValue(event.value);
            handleChange(event);
          }}
          inline
          mode="month"
          locale="en"
          calendarSystem="gregorian"
          dateFormat="mm/yyyy"
        />
      );
    }

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'August' }));
    expect(handleChange).toHaveBeenCalled();
    const emitted = handleChange.mock.calls.at(-1)[0].value;
    expect(emitted.getMonth()).toBe(7);
  });

  it('formats numeric month with lowercase mm token', () => {
    render(
      <Calendar
        locale="en"
        calendarSystem="gregorian"
        value={new Date(2024, 2, 20, 14, 5)}
        dateFormat="dd/mm/yyyy"
        onChange={() => {}}
      />
    );

    expect(screen.getByDisplayValue('20/03/2024')).toBeInTheDocument();
  });

  it('opens year picker grid in year mode', () => {
    render(
      <Calendar
        inline
        mode="year"
        locale="en"
        value={new Date(2024, 2, 20)}
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: '2024' })).toBeInTheDocument();
  });
});
